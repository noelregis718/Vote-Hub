import React from "react"
import { Button } from "@/components/ui/button"

export function Footer({
  logo,
  brandName,
  socialLinks,
  mainLinks,
  legalLinks,
  copyright,
}) {
  return (
    <footer className="pb-6 pt-16 lg:pb-8 lg:pt-24 border-t border-white/5 bg-black/20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="md:flex md:items-start md:justify-between">
          <a
            href="/"
            className="flex items-center gap-x-3 group"
            aria-label={brandName}
          >
            <div className="w-10 h-10 rounded-md bg-white flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-colors overflow-hidden">
              {logo}
            </div>
            <span className="font-bold text-2xl tracking-tight text-white">{brandName}</span>
          </a>
          <ul className="flex list-none mt-6 md:mt-0 space-x-4">
            {socialLinks.map((link, i) => (
              <li key={i}>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full border-white/10 hover:bg-white/5 transition-all hover:scale-110"
                  asChild
                >
                  <a href={link.href} target="_blank" rel="noreferrer" aria-label={link.label}>
                    {link.icon}
                  </a>
                </Button>
              </li>
            ))}
          </ul>
        </div>
        <div className="border-t border-white/5 mt-10 pt-10 md:mt-12 md:pt-12 lg:grid lg:grid-cols-10 gap-8">
          <nav className="lg:mt-0 lg:col-[4/11]">
            <ul className="list-none flex flex-wrap -my-2 -mx-4 lg:justify-end">
              {mainLinks.map((link, i) => (
                <li key={i} className="my-2 mx-4 shrink-0">
                  <a
                    href={link.href}
                    className="text-sm text-white hover:text-slate-300 transition-colors underline-offset-4 hover:underline font-medium"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-8 lg:mt-0 lg:col-[4/11]">
            <ul className="list-none flex flex-wrap -my-1 -mx-4 lg:justify-end">
              {legalLinks.map((link, i) => (
                <li key={i} className="my-1 mx-4 shrink-0">
                  <a
                    href={link.href}
                    className="text-xs text-white hover:text-slate-300 transition-colors underline-offset-4 hover:underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-8 text-sm leading-6 text-white whitespace-nowrap lg:mt-0 lg:row-[1/3] lg:col-[1/4] font-light">
            <div>{copyright.text}</div>
            {copyright.license && <div className="text-xs opacity-75">{copyright.license}</div>}
          </div>
        </div>
      </div>
    </footer>
  )
}
