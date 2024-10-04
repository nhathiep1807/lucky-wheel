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
import { TCreateWheelItemResponse } from '@/types/wheelItems';
import * as z from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateWheelItemMutation } from '@/hooks/wheel-items/useUpdateWheelItem';
import toast from 'react-hot-toast';
import { TypeErrorResponse } from '@/types/common';

type Color = {
    h: number;
    s: number;
    v: number;
    r: number;
    g: number;
    b: number;
    a: number;
    hex: string;
    rgba: string;
}

const UpdateWheelItemSchema = z.object({
    name: z.string().min(1, "Name must be at least 1 characters"),
    value: z.string().min(1, "Value must be at least 1 characters"),
    categoryId: z.string(),
    color: z.string(),
    img: z.string()
});

type UpdateWheelItemsForm = z.infer<typeof UpdateWheelItemSchema>

function AdminBoard() {
    const router = useRouter();
    const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false)
    const [isAdd, setIsAdd] = useState<boolean>(false)
    const [isCreateNew, setIsCreateNew] = useState<boolean>(false)
    const [isCustomItems, setIsCustomItems] = useState<boolean>(false)
    const [selectedItem, setSelectedItem] = useState<TCreateWheelItemResponse>()
    const [color, setColor] = useState<Color>();
    const [imgFile, setImgFile] = useState<File>()

    const { mutate: updateWheelItem } = useUpdateWheelItemMutation()

    const { userInfo, reset } = useContext(GlobalContext);

    const { handleSubmit, register, formState, setValue } = useForm<UpdateWheelItemsForm>({
        defaultValues: {
            name: "",
            value: "",
            categoryId: "",
            color: "",
            img: ""
        },
        resolver: zodResolver(UpdateWheelItemSchema),
    });


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

    const onClickCustomItems = (item: TCreateWheelItemResponse) => {
        setIsCustomItems(true)
        setSelectedItem(item)
        setValue('name', item.name)
        setValue('value', item.value.toString())
        setValue('categoryId', item.categoryId)
        setColor({ hex: item.color } as Color)
    }

    const onSubmit = (data: UpdateWheelItemsForm) => {
        let formData = new FormData()

        if (selectedItem) {
            formData.append('id', selectedItem.id.toString());
        } else {
            toast.error('No item selected');
        }
        formData.append('name', data.name)
        formData.append('value', data.value)
        formData.append('color', color?.hex ?? '')
        formData.append('categoryId', data.categoryId)
        if (imgFile) {
            formData.append('file', imgFile);
        } else {
            console.error('No file selected');
        }
        updateWheelItem(formData, {
            onSuccess: () => {
                toast.success('Update wheel item success!');
                setIsCustomItems(false)
            },
            onError: (error: any) => {
                const _error: TypeErrorResponse = error;
                toast.error(error);
            },
        })
    }

    const onClickCancelCustomItems = () => {
        setIsCustomItems(false)
    }

    const handleTakeFileImg = (file: File) => {
        setImgFile(file)
    }


    return (
        <div>
            <div className='flex justify-between items-center p-4 border-b'>
                <h3 className='ml-8 font-bold text-xl'>{userInfo?.name.toUpperCase()}</h3>
                <div className='flex gap-2'>
                    <Button name='Logout' onClick={onClickLogout} />
                </div>

            </div>
            <div className='flex justify-between px-4 pt-4 gap-2'>
                {/* <Button name='Custom Items' onClick={onClickCustomItems} /> */}
                <Button name='Add Player' onClick={onClickAddUser} />
            </div>
            <div className='p-4 max-h-[500px] min-h-[500px] border-b'>
                <DynamicInput />
                <ListItem handleUpdateWheelItem={onClickCustomItems} />
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
                <Button name="Update" onClick={handleSubmit(onSubmit)}></Button></div>}>
                <div className='grid gap-3'>
                    <Input
                        label='Name'
                        name="name"
                        type="text"
                        placeholder="Please input name!"
                        register={register}
                        error={formState.errors.name?.message}
                    />
                    <Input
                        label='Value'
                        name="value"
                        type="text"
                        placeholder="Please input value!"
                        register={register}
                        error={formState.errors.value?.message}
                    />
                    <Select
                        label='Categories'
                        name="categoryId"
                        placeholder="Select category"
                        register={register}
                        defaultValue=""
                        options={[{ value: '1', label: 'point' }, { value: '2', label: 'gift' }]}
                    />
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Select color</label>
                        <InputColor
                            initialValue="#000000"
                            onChange={setColor}
                            placement="right"
                        />
                    </div>
                    <ImagePicker handleTakeFileImg={handleTakeFileImg} />
                </div>
            </Dialog>
        </div>
    )
}

export default AdminBoard
