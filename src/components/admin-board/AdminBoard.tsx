import React from 'react'
import { Button } from '../button'
import { DynamicInput } from '../dynamic-input'
import EditableText from '../editable-text/EditAble'

function AdminBoard() {

    const onClickAddUser = () => {
        console.log('click add user!')
    }
    return (
        <div>
            <div className='flex justify-between items-center p-4 border-b'>
                <h3 className='ml-8 font-bold text-xl'>0985xxxxxx</h3>
                <Button name='Add' onClick={onClickAddUser} />
            </div>
            <div className='flex justify-end p-4'>
                <Button name='Custom Items' onClick={onClickAddUser} />
            </div>
            <div className='p-4 max-h-[400px] min-h-[400px] overflow-y-auto border-b'>
                <DynamicInput />
            </div>
            <EditableText initialText='Ruleaksfalsdkjákldjákldjaksljkl' />
        </div>
    )
}

export default AdminBoard