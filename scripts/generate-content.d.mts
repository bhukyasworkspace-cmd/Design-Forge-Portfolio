export declare function scanContent(options?: { quiet?: boolean }): {
  payload: {
    generatedAt: string
    totals: { categories: number; sections: number; items: number }
    categories: unknown[]
  }
  changed: boolean
}
