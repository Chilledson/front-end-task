// Example test proving the harness works — use it as a pattern for your own tests.
import { mount } from '@vue/test-utils'
import App from '../../App.vue'

describe('App', () => {
  it('renders the shell', () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('Emberforge')
  })
})
