"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

/**
 * Render the Avatar root element with consistent sizing and rounded styles.
 *
 * Applies default avatar classes and merges any provided `className`, and adds a `data-slot="avatar"` attribute.
 *
 * @param className - Additional CSS class names to merge with the component's default avatar styles
 * @returns The configured `AvatarPrimitive.Root` element
 */
function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders an avatar image slot with default aspect ratio and sizing.
 *
 * Applies "aspect-square" and full-size styles, merges any provided `className`, and forwards remaining props to the underlying image primitive.
 *
 * @param className - Additional CSS classes to merge with the default styles
 * @returns The rendered avatar image element
 */
function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  )
}

/**
 * Renders a styled fallback element used when an avatar image is unavailable.
 *
 * Accepts `className` and any props valid for `AvatarPrimitive.Fallback`; merges `className` with default fallback styles and forwards other props to the underlying Radix fallback element.
 *
 * @param className - Additional CSS classes to merge with the component's default styles
 * @returns A Radix `AvatarPrimitive.Fallback` element styled as a centered, rounded avatar fallback
 */
function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }