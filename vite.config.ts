import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { ConfigEnv, loadEnv, UserConfigExport } from 'vite'
export default ({ command, mode }: ConfigEnv): UserConfigExport => {
  const root = process.cwd()
  const env = loadEnv(mode, root)

  return {
    plugins: [vue()],
    server: {
      host: '0.0.0.0',
      port: 4000,
      proxy: {
        '/cif': {
          target: 'http://117.50.92.210:9113',
          changeOrigin: true
        }
      }
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './examples'),
        '~': resolve(__dirname, './packages')
      }
    }
  }
}
