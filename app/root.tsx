import type { LinksFunction, MetaFunction } from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react"
import tailwind from "./tailwind.css"

export const meta: MetaFunction = () => ({
  // eslint-disable-next-line unicorn/text-encoding-identifier-case
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
})

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwind },
]

export default function App() {
  return (
    <html lang="en" className="bg-neutral-900 text-neutral-50">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
