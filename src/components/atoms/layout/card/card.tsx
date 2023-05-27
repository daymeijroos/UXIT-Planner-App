import classNames from "classnames"
import React from "react"

export function Card(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={classNames('border-2 border-black py-4 px-4 text-black bg-white dark:bg-blue-gray-400 dark:text-white dark:border-blue-gray-600', props.className)}>
      {props.children}
    </div>
  )
}