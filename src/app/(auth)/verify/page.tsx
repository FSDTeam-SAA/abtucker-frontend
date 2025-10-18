import VerifyPage from '@/components/auth/Veryfiy'
import React, { Suspense } from 'react'

const page = () => {
  return (
   <Suspense fallback={<div>Loading verification page...</div>}>
    <VerifyPage />
   </Suspense>
  )
}

export default page