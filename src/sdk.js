export class AmpClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl
    this.token = localStorage.getItem('amp_token') || ''
  }
  hasToken() { return !!this.token }
  _headers() {
    const h = { 'Content-Type': 'application/json' }
    if (this.token) h['Authorization'] = 'Bearer ' + this.token
    return h
  }
  async _post(path, body) {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: this._headers(),
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include'
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
  }
  async login({ username, password, token }) {
    const data = await this._post('/Core/Login', { username, password, token, rememberMe: true })
    if (data?.sessionID) {
      this.token = data.sessionID
      localStorage.setItem('amp_token', this.token)
    }
    return data
  }
  logout() {
    this.token = ''
    localStorage.removeItem('amp_token')
  }
  async getUserInfo() { return this._post('/User/GetUserInfo') }
  async getInstances() { return this._post('/ADSModule/GetInstances') }
  async startInstance(InstanceID) { return this._post('/ADSModule/StartInstance', { InstanceID }) }
  async stopInstance(InstanceID) { return this._post('/ADSModule/StopInstance', { InstanceID }) }
  async restartInstance(InstanceID) { return this._post('/ADSModule/RestartInstance', { InstanceID }) }
}
