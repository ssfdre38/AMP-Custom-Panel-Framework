// Minimal Vite config without importing 'vite' to avoid resolution issues
export default ({ mode }) => {
  const target = (process.env.VITE_AMP_API_BASE || 'http://localhost:8080').replace(/\/$/, '')
  return {
    server: {
      proxy: {
        '/API': { target, changeOrigin: true }
      }
    }
  }
}
