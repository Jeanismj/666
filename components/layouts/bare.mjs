import { useRouter } from 'next/router'
import { AsideNavigation } from 'components/navigation/aside.mjs'

export const ns = []

export const BareLayout = ({ app, children = [] }) => (
  <>
    <AsideNavigation app={app} mobileOnly />
    {children}
  </>
)
