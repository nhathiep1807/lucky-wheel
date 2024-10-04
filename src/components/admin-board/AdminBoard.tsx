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
import { useCreateNewUserMutation } from '@/hooks/users/useCreateNewUser';
import { TCreateNewUserResquest } from '@/types/user';

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
    categoryId: z.any(),
    weight: z.any(),
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

    const { mutate: updateWheelItem, isPending } = useUpdateWheelItemMutation()
    const { mutate: createNewUser, isPending: isLoadingCreateNewUser } = useCreateNewUserMutation()

    const { userInfo, reset } = useContext(GlobalContext);

    const { handleSubmit, register, formState, setValue, getValues } = useForm<UpdateWheelItemsForm>({
        defaultValues: {
            name: "",
            value: "",
            categoryId: "",
            weight: '0',
            color: "",
            img: "",
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

    const onClickExecuteCreate = () => {
        // const { userPhoneNumber, userName } = getValues()
        // console.log('userPhoneNumber', userPhoneNumber, userName)
        // const data: TCreateNewUserResquest = {
        //     phoneNumber: userPhoneNumber,
        //     name: userName
        // }
        // createNewUser(data, {
        //     onSuccess: () => {
        //         toast.success('Create user is successfully!');
        //         setIsCreateNew(false)
        //     },
        //     onError: (error: any) => {
        //         const _error: TypeErrorResponse = error;
        //         toast.error(error);
        //     },
        // })
    }

    const onClickGetUser = () => {

    }

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
        setValue('weight', item.weight)
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
        formData.append('weight', data.weight)
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
                <Button name="Add" onClick={onClickGetUser}></Button></div>}>
                <Input
                    name="phone"
                    type="text"
                    placeholder="Please input your mobilephone..."
                />
            </Dialog>
            <Dialog open={isCreateNew} title="Your account" setOpen={setIsCreateNew} actionButton={<div className='flex items-center gap-2 pt-4'><Button name="Cancel" onClick={onClickCancelCreatNew}></Button>
                <Button name="Add" onClick={onClickExecuteCreate} isLoading={isLoadingCreateNewUser}></Button></div>}>
                <div>
                    <Input
                        className='pb-2'
                        name="userName"
                        type="text"
                        placeholder="Please input your name..."
                        register={register}
                    // error={formState.errors.userName?.message}
                    />
                    <Input
                        name="userPhoneNumber"
                        type="text"
                        placeholder="Please input your phone number..."
                        register={register}
                    // error={formState.errors.userPhoneNumber?.message}
                    />
                </div>
            </Dialog>
            <Dialog open={isCustomItems} title="Update Items" setOpen={setIsCustomItems} actionButton={<div className='flex items-center gap-2 pt-4'><Button name="Cancel" onClick={onClickCancelCustomItems}></Button>
                <Button name="Update" onClick={handleSubmit(onSubmit)} isLoading={isPending}></Button></div>}>
                <div className='grid gap-3'>
                    <form>
                        <Input
                            label='Name'
                            name="name"
                            type="text"
                            placeholder="Please input name!"
                            register={register}
                            error={formState.errors.name?.message}
                        />
                        <div className='flex w-full gap-2'>
                            <Input
                                label='Value'
                                name="value"
                                type="text"
                                placeholder="Please input value!"
                                register={register}
                                error={formState.errors.value?.message}
                            />
                            <Input
                                label='Weight'
                                name="weight"
                                type="number"
                                register={register}
                            />
                        </div>
                        <Select
                            label='Categories'
                            name="categoryId"
                            placeholder="Select category"
                            register={register}
                            options={[{ value: '1', label: 'point' }, { value: '2', label: 'gift' }]}
                        />
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Select color</label>
                            <InputColor
                                initialValue={selectedItem?.color || '#000000'}
                                onChange={setColor}
                                placement="right"
                            />
                        </div>
                        <ImagePicker handleTakeFileImg={handleTakeFileImg} />
                    </form>
                </div>
            </Dialog>
        </div>
    )
}

export default AdminBoard
