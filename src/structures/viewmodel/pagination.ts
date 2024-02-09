type TPagination<T> = {
  pageNumber: number
  pageSize: number
  totalPages: number
  totalRecords: number
  data: T[]
}

export default TPagination
