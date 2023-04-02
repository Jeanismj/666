// Dependencies
import React, { useState, useEffect } from 'react'
import { useSwipeable } from 'react-swipeable'
import { useHotkeys } from 'react-hotkeys-hook'
// Hooks
import { useTheme } from 'hooks/use-theme.mjs'
// Components
import { LayoutWrapper, ns as layoutNs } from 'components/wrappers/layout.mjs'
import { BareLayout, ns as bareNs } from 'components/layouts/bare.mjs'

export const ns = [...new Set([...layoutNs, ...bareNs])]

/* This component should wrap all page content */
export const PageWrapper = ({
  app = false,
  layout = BareLayout,
  footer = true,
  children = [],
  title = 'FIXME: No title set',
}) => {
  /*
   * This forces a re-render upon initial bootstrap of the app
   * This is needed to avoid hydration errors because theme can't be set reliably in SSR
   */
  const [theme, setTheme] = useTheme()
  const [currentTheme, setCurrentTheme] = useState()
  useEffect(() => setCurrentTheme(theme), [currentTheme, theme])

  /*
   * Swipe handling for the entire site
   */
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => (app.state?.menu?.main ? app.updateState('menu.main', false) : null),
    onSwipedRight: () => (app.state?.menu?.main ? null : app.updateState('menu.main', true)),
    trackMouse: true,
  })

  /*
   * Hotkeys (keyboard actions)
   */

  // Always close modal when Escape key is hit
  useHotkeys('esc', (evt) => {
    evt.preventDefault()
    app.updateState('modal', null)
  })

  // Helper object to pass props down (keeps things DRY)
  const childProps = {
    app: app,
    footer,
    title: app.state.title ? app.state.title : title,
  }

  // Make layout prop into a (uppercase) component
  const Layout = layout

  // Return wrapper
  return (
    <div
      ref={swipeHandlers.ref}
      onMouseDown={swipeHandlers.onMouseDown}
      data-theme={currentTheme} // This facilitates CSS selectors
      key={currentTheme} // This forces the data-theme update
    >
      <LayoutWrapper {...childProps}>
        {Layout ? <Layout {...childProps}>{children}</Layout> : children}
      </LayoutWrapper>
      {app.state.modal ? (
        <div
          className={`fixed top-0 left-0 m-0 p-0 shadow drop-shadow-lg w-full h-screen
              bg-neutral bg-opacity-90 z-50 hover:cursor-pointer
              flex flex-row items-center justify-center
            `}
          onClick={() => app.updateState('modal', false)}
        >
          {app.state.modal}
        </div>
      ) : null}
    </div>
  )
}
