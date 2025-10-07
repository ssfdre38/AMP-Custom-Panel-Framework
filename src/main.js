import './style.css'
import { AmpClient } from './sdk.js'

const apiBase = localStorage.getItem('amp_api_base') || 'http://localhost:8080/API'
const client = new AmpClient(apiBase)

const app = document.getElementById('app')

function setStatus(text) {
  document.getElementById('status').textContent = text
}

async function loginFormSubmit(e) {
  e.preventDefault()
  const username = document.getElementById('username').value
  const password = document.getElementById('password').value
  const base = document.getElementById('apiBase').value
  localStorage.setItem('amp_api_base', base)
  client.baseUrl = base
  const res = await client.login({ username, password })
  if (!res.success) {
    setStatus('Login failed')
    return
  }
  setStatus('Logged in')
  renderDashboard()
}

async function renderDashboard() {
  const me = await client.getUserInfo().catch(() => null)
  const instances = await client.getInstances().catch(() => [])
  app.innerHTML = `
  <div class="toolbar">
    <button id="logout">Logout</button>
    <span>${me ? me.Username : ''}</span>
  </div>
  <div class="content">
    <h2>Instances</h2>
    <table>
      <thead><tr><th>Name</th><th>ID</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>
        ${instances.map(i => `
          <tr>
            <td>${i.FriendlyName || i.InstanceName || ''}</td>
            <td>${i.InstanceID || i.Id || ''}</td>
            <td>${i.Status || i.State || ''}</td>
            <td>
              <button data-act="start" data-id="${i.InstanceID}">Start</button>
              <button data-act="stop" data-id="${i.InstanceID}">Stop</button>
              <button data-act="restart" data-id="${i.InstanceID}">Restart</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  `
  app.querySelector('#logout').onclick = () => { client.logout(); location.reload() }
  app.querySelectorAll('button[data-id]').forEach(btn => {
    btn.onclick = async () => {
      const id = btn.dataset.id
      const act = btn.dataset.act
      setStatus(`${act}...`)
      if (act === 'start') await client.startInstance(id)
      if (act === 'stop') await client.stopInstance(id)
      if (act === 'restart') await client.restartInstance(id)
      await renderDashboard()
    }
  })
}

function renderLogin() {
  app.innerHTML = `
  <div class="login">
    <h1>AMP Custom Panel</h1>
    <form id="loginForm">
      <label>API Base <input id="apiBase" value="${apiBase}"/></label>
      <label>Username <input id="username"/></label>
      <label>Password <input id="password" type="password"/></label>
      <button type="submit">Login</button>
      <span id="status"></span>
    </form>
  </div>`
  document.getElementById('loginForm').addEventListener('submit', loginFormSubmit)
}

if (client.hasToken()) {
  renderDashboard()
} else {
  renderLogin()
}
