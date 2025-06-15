<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vitepress'

const route = useRoute()
const router = useRouter()
const status = ref('Fetching download...')
const debugInfo = ref('')

const closeTabOrRedirect = (delay = 1000) => {
  setTimeout(() => {
    status.value = 'Download completed! You can now close this tab.'
    window.close()
    
    setTimeout(() => {
      if (!window.closed) {
        status.value = 'Redirecting to homepage...'
        redirectToHomePage()
      }
    }, 3000)
  }, delay)
}

const redirectToHomePage = async () => {
  try {
    await router.go('/')
  } catch (error) {
    console.log('Router navigation failed, using window.location')
    window.location.href = '/'
  }
}

const logDebug = (message, data = null) => {
  console.log(message, data)
  debugInfo.value += `${message}\n${data ? JSON.stringify(data, null, 2) : ''}\n\n`
}

onMounted(async () => {
  try {
    let user, repo
    const fileExtensions = ['.jar']

    // Parse URL parameters
    const urlParams = new URLSearchParams(window.location.search)
    
    if (urlParams.has('user') && urlParams.has('repo')) {
      user = urlParams.get('user')
      repo = urlParams.get('repo')
    } else if (window.location.search) {
      const searchString = window.location.search.substring(1)
      const firstParam = searchString.split('&')[0]
      
      if (firstParam.includes('/')) {
        const parts = firstParam.split('/')
        if (parts.length === 2) {
          user = parts[0]
          repo = parts[1]
        }
      }
    }

    logDebug('Parsed parameters:', { user, repo, url: window.location.href })

    if (!user || !repo) {
      status.value = 'Missing user or repo parameter. Closing tab...'
      closeTabOrRedirect(500)
      return
    }

    status.value = `Fetching release data for ${user}/${repo}...`

    // First, check if the repository exists and is accessible
    const repoResponse = await fetch(`https://api.github.com/repos/${user}/${repo}`)
    
    if (!repoResponse.ok) {
      if (repoResponse.status === 404) {
        throw new Error(`Repository ${user}/${repo} not found or is private`)
      } else if (repoResponse.status === 403) {
        throw new Error(`Access forbidden to ${user}/${repo}. API rate limit exceeded or repository is private`)
      } else {
        throw new Error(`GitHub API returned ${repoResponse.status}: ${repoResponse.statusText}`)
      }
    }

    const repoData = await repoResponse.json()
    logDebug('Repository data:', repoData)

    // Check if the repository has releases
    const releasesResponse = await fetch(`https://api.github.com/repos/${user}/${repo}/releases`)
    
    if (!releasesResponse.ok) {
      throw new Error(`Failed to fetch releases: ${releasesResponse.status} ${releasesResponse.statusText}`)
    }

    const allReleases = await releasesResponse.json()
    logDebug('All releases:', allReleases)

    if (!Array.isArray(allReleases) || allReleases.length === 0) {
      status.value = 'No releases found in this repository. Closing tab...'
      alert(`No releases found in ${user}/${repo}. The repository might not have any published releases.`)
      closeTabOrRedirect(2000)
      return
    }

    // Get the latest release
    const latestRelease = allReleases[0]
    logDebug('Latest release:', latestRelease)

    if (!latestRelease.assets || latestRelease.assets.length === 0) {
      status.value = 'No assets found in the latest release. Checking other releases...'
      
      // Check other releases for assets
      let foundAsset = null
      let foundRelease = null
      
      for (const release of allReleases) {
        if (release.assets && release.assets.length > 0) {
          for (const ext of fileExtensions) {
            const asset = release.assets.find(asset => asset.name.toLowerCase().endsWith(ext.toLowerCase()))
            if (asset) {
              foundAsset = asset
              foundRelease = release
              break
            }
          }
          if (foundAsset) break
        }
      }
      
      if (!foundAsset) {
        status.value = 'No downloadable assets found in any releases. Closing tab...'
        alert(`No downloadable assets found in any releases of ${user}/${repo}.\n\nAvailable assets in latest release: ${latestRelease.assets.map(a => a.name).join(', ') || 'None'}`)
        closeTabOrRedirect(2000)
        return
      }
      
      logDebug('Found asset in older release:', { asset: foundAsset, release: foundRelease.tag_name })
      
      status.value = `Downloading ${foundAsset.name} from release ${foundRelease.tag_name}...`
      
      // Download the found asset
      const link = document.createElement('a')
      link.href = foundAsset.browser_download_url
      link.download = foundAsset.name
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      status.value = 'Download started! Closing tab...'
      closeTabOrRedirect(1500)
      return
    }

    // Look for supported file types in the latest release
    let asset = null
    for (const ext of fileExtensions) {
      asset = latestRelease.assets.find(asset => asset.name.toLowerCase().endsWith(ext.toLowerCase()))
      if (asset) break
    }
    
    if (!asset) {
      const availableAssets = latestRelease.assets.map(a => a.name).join(', ')
      status.value = 'No supported file type found. Closing tab...'
      alert(`No supported file types (${fileExtensions.join(', ')}) found in the latest release.\n\nAvailable assets: ${availableAssets}`)
      closeTabOrRedirect(2000)
      return
    }

    status.value = `Downloading ${asset.name}...`
    logDebug('Downloading asset:', asset)
    
    // Create and trigger download
    const link = document.createElement('a')
    link.href = asset.browser_download_url
    link.download = asset.name
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    status.value = 'Download started! Closing tab...'
    closeTabOrRedirect(1500)
    
  } catch (error) {
    console.error('Download error:', error)
    logDebug('Error occurred:', error)
    status.value = `Error: ${error.message}. Closing tab...`
    alert(`Failed to download from ${user}/${repo}:\n\n${error.message}\n\nCheck the console for more details.`)
    closeTabOrRedirect(3000)
  }
})
</script>

<template>
  <div style="text-align: center; margin-top: 2rem; padding: 2rem;">
    <p>{{ status }}</p>
    <div style="margin-top: 1rem;">
      <small style="color: #666;">
        Download completed! You can close this tab manually, or it will redirect automatically.
      </small>
    </div>
    
    <!-- Debug information (only shown in development) -->
    <details style="margin-top: 2rem; text-align: left; max-width: 800px; margin-left: auto; margin-right: auto;">
      <summary style="cursor: pointer; color: #666;">Debug Information</summary>
      <pre style="padding: 1rem; border-radius: 4px; overflow: auto; font-size: 12px; white-space: pre-wrap;">{{ debugInfo }}</pre>
    </details>
  </div>
</template>