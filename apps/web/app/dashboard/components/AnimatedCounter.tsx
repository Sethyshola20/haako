'use client';



const AnimatedCounter = ({ amount }: { amount: number }) => {
  return (
    <div className="w-full">
      {"amount:"+amount}
    </div>
  )
}

export default AnimatedCounter