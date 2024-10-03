import React from 'react'

function ClientBoard() {
    return (
        <div className='fixed top-20 left-0'>
            <div className="relative p-[4px] min-w-[200px] w-fit rounded-md bg-gray-800 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 shadow-[0_0_0_1px_#fff,inset_0_0_0_1px_#fff,0_0_3px_#08f,0_0_5px_#08f,0_0_10px_#08f,0_0_15px_#08f]"></div>
                <div className="relative bg-gray-800 rounded-md p-4 z-10">
                    <h2 className="font-semibold text-xl text-white">Selena Contana</h2>
                    <h3 className="text-white">Points: <span className="font-medium">100</span></h3>
                    <div className='border my-6'></div>
                    <h2 className="font-semibold text-3xl text-yellow-500 italic underline">Ranking</h2>
                    <ol className='text-white list-decimal p-4' type='1'>
                        <li>Christian Di</li>
                        <li>Selena Contana</li>
                        <li>Justin Charles</li>
                        <li>Jame Sandy</li>
                    </ol>
                </div>
            </div>
        </div>

    )
}

export default ClientBoard