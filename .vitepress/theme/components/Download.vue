<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vitepress'

const route = useRoute()
const router = useRouter()
const status = ref('Fetching download...')

const closeTabOrRedirect = (delay = 1000) => {
  setTimeout(() => {
    // Show a message asking user to close the tab
    status.value = 'Download completed! You can now close this tab.'
    
    // Try to close the tab
    window.close()
    
    // If tab doesn't close after 3 seconds, redirect
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

onMounted(async () => {
  try {
    let user, repo
    const fileExtension = '.jar'

    // Parse URL parameters - support multiple formats
    const urlParams = new URLSearchParams(window.location.search)
    
    // Format 1: ?user=Zgoly&repo=Meteorist
    if (urlParams.has('user') && urlParams.has('repo')) {
      user = urlParams.get('user')
      repo = urlParams.get('repo')
    }
    // Format 2: ?Zgoly/Meteorist (first query parameter)
    else if (window.location.search) {
      const searchString = window.location.search.substring(1) // Remove '?'
      const firstParam = searchString.split('&')[0] // Get first parameter
      
      if (firstParam.includes('/')) {
        const parts = firstParam.split('/')
        if (parts.length === 2) {
          user = parts[0]
          repo = parts[1]
        }
      }
    }

    console.log('Parsed params:', { user, repo })
    console.log('Full URL:', window.location.href)
    console.log('Search params:', window.location.search)

    if (!user || !repo) {
      status.value = 'Missing user or repo parameter. Closing tab...'
      closeTabOrRedirect(500)
      return
    }

    status.value = `Fetching release data for ${user}/${repo}...`

    const response = await fetch(`https://api.github.com/repos/${user}/${repo}/releases/latest`)
    
    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    
    console.log('GitHub API response:', data)

    if (!data.assets || data.assets.length === 0) {
      status.value = 'No assets found in the latest release. Closing tab...'
      alert('No assets found in the latest release.')
      closeTabOrRedirect(2000)
      return
    }

    const asset = data.assets.find(asset => asset.name.endsWith(fileExtension))
    
    if (!asset) {
      status.value = `No ${fileExtension} file found. Closing tab...`
      alert(`No ${fileExtension} file found in the latest release.`)
      closeTabOrRedirect(2000)
      return
    }

    status.value = `Downloading ${asset.name}...`
    
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
    status.value = `Error: ${error.message}. Closing tab...`
    alert(`Failed to fetch release data: ${error.message}`)
    closeTabOrRedirect(2000)
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
  </div>
</template>