"use client";
import { GlobalContext } from '@/app/context'
import cookie from '@/utils/cookie'
import { useRouter } from 'next/navigation'
import React, { useContext } from 'react'
import { useState } from 'react'
import { Button } from '../button'
import { Dialog } from '../dialog'
import { DynamicInput } from '../dynamic-input'
import EditableText from '../editable-text/EditAble'
import { Input } from '../input'
import { Select } from '../select';
import InputColor from 'react-input-color';
import { ImagePicker } from '../image-picker';
import { ListItem } from '../list-item';

function AdminBoard() {
    const router = useRouter();
    const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false)
    const [isAdd, setIsAdd] = useState<boolean>(false)
    const [isCreateNew, setIsCreateNew] = useState<boolean>(false)
    const [isCustomItems, setIsCustomItems] = useState<boolean>(false)
    const [color, setColor] = useState({});

    const { userInfo, reset } = useContext(GlobalContext);

    const onClickAddUser = () => {
        setIsOpenDialog(true)
    }

    const onClickAddAccount = () => {
        setIsAdd(true)
        setIsOpenDialog(false)
    }

    const onClickCreateNewAccount = () => {
        setIsCreateNew(true)
        setIsOpenDialog(false)
    }

    const onClickCancelAdd = () => {
        setIsAdd(false)
    }

    const onClickCancelCreatNew = () => {
        setIsCreateNew(false)
    }

    const onClickExecuteCreate = () => { }

    const onClickLogout = () => {
        cookie.delete("accessToken");
        reset();
        router.push("/login");
    }

    const onClickCustomItems = () => {
        setIsCustomItems(true)
    }

    const onClickUpdateItem = () => {

    }

    const onClickCancelCustomItems = () => {
        setIsCustomItems(false)
    }


    return (
        <div>
            <div className='flex justify-between items-center p-4 border-b'>
                <h3 className='ml-8 font-bold text-xl'>{userInfo?.phoneNumber}</h3>
                <div className='flex gap-2'>
                    <Button name='Logout' onClick={onClickLogout} />
                </div>

            </div>
            <div className='flex justify-between px-4 pt-4 gap-2'>
                <Button name='Custom Items' onClick={onClickCustomItems} />
                <Button name='Add Player' onClick={onClickAddUser} />
            </div>
            <div className='p-4 max-h-[500px] min-h-[500px] border-b'>
                <DynamicInput />
                <ListItem />
            </div>
            <EditableText initialText='Please input your rule here!' />
            <Dialog open={isOpenDialog} title="Are you have an account ?" setOpen={setIsOpenDialog} actionButton={<div className='flex items-center gap-2 py-2'><Button name="Yes" onClick={onClickAddAccount}></Button>
                <Button name="Create New" onClick={onClickCreateNewAccount}></Button></div>}>
                <div>If you want to accumulate points for yourself,
                    please provide us with your information!</div>
            </Dialog>
            <Dialog open={isAdd} title="Your account" setOpen={setIsAdd} actionButton={<div className='flex items-center gap-2 pt-4'><Button name="Cancel" onClick={onClickCancelAdd}></Button>
                <Button name="Add" onClick={onClickExecuteCreate}></Button></div>}>
                <Input
                    name="phone"
                    type="text"
                    placeholder="Please input your mobilephone..."
                />
            </Dialog>
            <Dialog open={isCreateNew} title="Your account" setOpen={setIsCreateNew} actionButton={<div className='flex items-center gap-2 pt-4'><Button name="Cancel" onClick={onClickCancelCreatNew}></Button>
                <Button name="Add" onClick={onClickExecuteCreate}></Button></div>}>
                <div>
                    <Input
                        className='pb-2'
                        name="name"
                        type="text"
                        placeholder="Please input your name..."
                    />
                    <Input
                        name="phone"
                        type="text"
                        placeholder="Please input your mobilephone..."
                    />
                </div>

            </Dialog>
            <Dialog open={isCustomItems} title="Update Items" setOpen={setIsCustomItems} actionButton={<div className='flex items-center gap-2 pt-4'><Button name="Cancel" onClick={onClickCancelCustomItems}></Button>
                <Button name="Update" onClick={onClickUpdateItem}></Button></div>}>
                <div className='grid gap-3'>
                    <Select
                        label='Name'
                        name="item"
                        placeholder="Select item"
                        defaultValue=""
                        options={[{ value: '10', label: '10 cuc da' }, { value: '20', label: '20 cuc da' }]}
                    // error={formState.errors.category?.message}
                    />
                    <Input
                        label='Value'
                        name="value"
                        type="text"
                        placeholder="Please input value!"
                    />
                    <Select
                        label='Categories'
                        name="categories"
                        placeholder="Select category"
                        defaultValue=""
                        options={[{ value: '1', label: 'point' }, { value: '1', label: 'gift' }]}
                    // error={formState.errors.category?.message}
                    />
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Select color</label>
                        <InputColor
                            initialValue="#000000"
                            onChange={setColor}
                            placement="right"

                        />
                    </div>

                    <ImagePicker />
                </div>

            </Dialog>
        </div>
    )
}

export default AdminBoard
