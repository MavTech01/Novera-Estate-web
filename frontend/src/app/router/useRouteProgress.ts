import { useEffect } from 'react'
import NProgress from 'nprogress'

NProgress.configure({ showSpinner: false, trickleSpeed: 200 })

export function useRouteProgress(isPageChange: boolean): void {
  useEffect(() => {
    if (isPageChange) NProgress.start()
    else NProgress.done()
  }, [isPageChange])
}
