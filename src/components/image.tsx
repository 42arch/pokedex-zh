/* eslint-disable next/no-img-element */
import NextImage from 'next/image'

interface Props {
  className?: string
  src: string
  alt: string
  width: number
  height: number
}

const imageOptimization = process.env.NEXT_PUBLIC_IMAGE_OPTIMIZATION

export default function Image({ className, src, alt, width, height }: Props) {
  return (
    <>
      {imageOptimization
        ? (
            <NextImage
              className={className}
              src={src}
              alt={alt}
              width={width}
              height={height}
            />
          )
        : (
            <img
              className={className}
              src={src}
              alt={alt}
              width={width}
              height={height}
            />
          )}
    </>
  )
}
