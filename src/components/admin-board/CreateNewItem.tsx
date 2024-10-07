import { useCreateWheelItemMutation } from '@/hooks/wheel-items/useCreateWheelItem'
import React from 'react'
import { useState } from 'react'
import InputColor from 'react-input-color'
import { Button } from '../button'
import { Dialog } from '../dialog'
import { ImagePicker } from '../image-picker'
import { Input } from '../input'
import { Select } from '../select'
import * as z from "zod";
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TypeErrorResponse } from '@/types/common'
import toast from 'react-hot-toast'

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
};

const CreateWheelItemSchema = z.object({
    name: z.string().min(1, "Name must be at least 1 characters"),
    value: z.string().min(1, "Value must be at least 1 characters"),
    categoryId: z.any(),
    weight: z.any(),
    color: z.string(),
    img: z.string(),
});

type CreateWheelItemsForm = z.infer<typeof CreateWheelItemSchema>;

function CreateNewItem() {
    const [isOpenCreateNew, setIsOpenCreateNew] = useState<boolean>(false)
    const [color, setColor] = useState<Color>();
    const [imgFile, setImgFile] = useState<File>()

    const { mutate: creacreateWheelItem, isPending: isPendingCreateNewItem } = useCreateWheelItemMutation()


    const { handleSubmit, register, formState, setValue } = useForm<CreateWheelItemsForm>({
        defaultValues: {
            name: "",
            value: "",
            categoryId: "",
            weight: '0',
            color: "",
            img: "",
        },
        resolver: zodResolver(CreateWheelItemSchema),
    });

    const handleOpenCreateNew = () => {
        setIsOpenCreateNew(true)
    }

    const handleTakeFileImg = (file: File) => {
        setImgFile(file);
    };

    const handleClickCancelCreateNewItem = () => {
        setIsOpenCreateNew(false)
    }

    const onSubmit = (data: CreateWheelItemsForm) => {
        let formData = new FormData()
        formData.append("name", data.name);
        formData.append("value", data.value);
        formData.append("color", color?.hex ?? "");
        formData.append("categoryId", data.categoryId);
        formData.append("weight", data.weight);
        formData.append("file", imgFile || '')
        creacreateWheelItem(formData,
            {
                onSuccess: (data) => {
                    toast.success('Create wheel item success!');
                    setIsOpenCreateNew(false)
                    setImgFile(undefined)
                },
                onError: (error: any) => {
                    const _error: TypeErrorResponse = error;
                    toast.error(error);
                },
            })
    }
    return (
        <div>
            <Button name="Add Item" onClick={handleOpenCreateNew}></Button>
            <Dialog open={isOpenCreateNew} title="Create New Item" setOpen={setIsOpenCreateNew} actionButton={<div className='flex items-center gap-2 pt-4'><Button name="Cancel" onClick={handleClickCancelCreateNewItem}></Button>
                <Button name="Create" onClick={handleSubmit(onSubmit)} isLoading={isPendingCreateNewItem}></Button></div>}>
                <div className='grid'>
                    <form className='gap-4'>
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
                                initialValue={'#000000'}
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

export default CreateNewItem