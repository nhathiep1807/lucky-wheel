"use client";
import { GlobalContext } from "@/app/context";
import { useCreateNewUserMutation } from "@/hooks/users/useCreateNewUser";
import { useCreateNewUserForm } from "@/hooks/users/useCreateNewUserForm";
import { useGetUserQuery } from "@/hooks/users/useGetUserByPhone";
import { useGetUserByPhoneForm } from "@/hooks/users/useGetUserByPhoneForm";
import { useUpdateWheelItemMutation } from "@/hooks/wheel-items/useUpdateWheelItem";
import { TypeErrorResponse } from "@/types/common";
import { TCreateNewUserResquest } from "@/types/user";
import { TCreateWheelItemResponse } from "@/types/wheelItems";
import cookie from "@/utils/cookie";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import InputColor from "react-input-color";
import * as z from "zod";
import { Button } from "../button";
import { Dialog } from "../dialog";
import EditableText from "../editable-text/EditAble";
import { ImagePicker } from "../image-picker";
import { Input } from "../input";
import { ListItem } from "../list-item";
import { Select } from "../select";
import CreateNewItem from "./CreateNewItem";
import Redeem from "./Redeem";

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

const UpdateWheelItemSchema = z.object({
  name: z.string().min(1, "Name must be at least 1 characters"),
  value: z.string().min(1, "Value must be at least 1 characters"),
  categoryId: z.any(),
  weight: z.any(),
  color: z.string(),
  img: z.string(),
});

type UpdateWheelItemsForm = z.infer<typeof UpdateWheelItemSchema>;

function AdminBoard() {
  const router = useRouter();
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const [isAdd, setIsAdd] = useState<boolean>(false);
  const [isCreateNew, setIsCreateNew] = useState<boolean>(false);
  const [isCustomItems, setIsCustomItems] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<TCreateWheelItemResponse>();
  const [color, setColor] = useState<Color>();
  const [imgFile, setImgFile] = useState<File>();
  const [playerPhone, setPlayerPhone] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isOpenCreateNewItem, setIsOpenCreateNewItem] =
    useState<boolean>(false);
  const [isOpenRedeem, setIsOpenRedeem] = useState<boolean>(false)


  const {
    submitNewUser,
    registerNewUser,
    formStateNewUser,
    resetCreateUserForm,
  } = useCreateNewUserForm();
  const { submitGetUser, registerGetUser, formStateGetUser } =
    useGetUserByPhoneForm();

  const {
    data: playerInformation,
    isLoading,
    isSuccess,
  } = useGetUserQuery({ phone: playerPhone });

  const { mutate: updateWheelItem, isPending } = useUpdateWheelItemMutation();
  const { mutate: createNewUser, isPending: isLoadingCreateNewUser } =
    useCreateNewUserMutation();

  const { userInfo, reset, setPlayerInfo, playerInfo } = useContext(GlobalContext);

  const { handleSubmit, register, formState, setValue } =
    useForm<UpdateWheelItemsForm>({
      defaultValues: {
        name: "",
        value: "",
        categoryId: "",
        weight: "0",
        color: "",
        img: "",
      },
      resolver: zodResolver(UpdateWheelItemSchema),
    });

  const onClickAddUser = () => {
    setIsOpenDialog(true);
  };

  const onClickAddAccount = () => {
    setIsAdd(true);
    setIsOpenDialog(false);
  };

  const onClickCreateNewAccount = () => {
    setIsCreateNew(true);
    setIsOpenDialog(false);
  };

  const onClickCancelAdd = () => {
    setIsAdd(false);
  };

  const onClickCancelCreatNew = () => {
    setIsCreateNew(false);
  };

  const onClickGetUser = (data: { phone: string }) => {
    setPlayerPhone(data.phone);
    if (isSuccess) {
      toast.success("Add player successfully!");
    }
    setIsAdd(false);
  };

  const onClickExecuteCreate = (data: TCreateNewUserResquest) => {
    createNewUser(data, {
      onSuccess: (data) => {
        if (data.message) {
          toast.error(data.message);
        } else {
          toast.success("Create user is successfully!");
          setIsCreateNew(false);
          resetCreateUserForm();
        }
      },
      onError: (error: any) => {
        const _error: TypeErrorResponse = error;
        toast.error(error);
        resetCreateUserForm();
      },
    });
  };

  const onClickLogout = () => {
    cookie.delete("accessToken");
    reset();
    router.push("/login");
  };

  const onClickCustomItems = (item: TCreateWheelItemResponse) => {
    setIsCustomItems(true);
    setSelectedItem(item);
    setValue("name", item.name);
    setValue("value", item.value.toString());
    setValue("categoryId", item.categoryId);
    setValue("weight", item.weight);
    setColor({ hex: item.color } as Color);
  };

  const onSubmit = (data: UpdateWheelItemsForm) => {
    let formData = new FormData();

    if (selectedItem) {
      formData.append("id", selectedItem.id.toString());
    } else {
      toast.error("No item selected");
    }

    formData.append("name", data.name);
    formData.append("value", data.value);
    formData.append("color", color?.hex ?? "");
    formData.append("categoryId", data.categoryId);
    formData.append("weight", data.weight);
    if (imgFile) {
      formData.append("file", imgFile);
    }
    if (selectedImage !== null && !imgFile) {
      formData.append("file", selectedItem?.img || "");
    }
    if (selectedImage === null && !imgFile) {
      formData.append("file", "");
    }

    updateWheelItem(formData, {
      onSuccess: () => {
        toast.success("Update wheel item success!");
        setIsCustomItems(false);
        setImgFile(undefined);
      },
      onError: (error: any) => {
        const _error: TypeErrorResponse = error;
        toast.error(error);
      },
    });
  };

  const onClickCancelCustomItems = () => {
    setIsCustomItems(false);
  };

  const handleTakeFileImg = (file: File) => {
    setImgFile(file);
  };

  const handleImageChange = (imageUrl: string | null) => {
    setSelectedImage(imageUrl);
  };

  const onClickCloseRedeem = () => {
    setIsOpenRedeem(false)
  }

  const onOpenRedeem = () => {
    setIsOpenRedeem(true)
  }

  useEffect(() => {
    if (playerInformation && playerInformation !== null)
      setPlayerInfo(playerInformation?.data);
  }, [playerInformation]);

  return (
    <div>
      <div className="flex justify-between items-center p-4 border-b bg-green-300">
        <h3 className="ml-8 font-bold text-xl">
          {userInfo?.name?.toUpperCase()}
        </h3>
        <div className="flex gap-2">
          <Button name="Logout" onClick={onClickLogout} />
        </div>
      </div>
      <div className="flex px-4 pt-4 gap-2 bg-yellow-300">
        <CreateNewItem
          isOpen={isOpenCreateNewItem}
          handleIsOpen={setIsOpenCreateNewItem}
        />
        <Button name={playerInfo?.name ? "Switch Player" : "Add Player"} onClick={onClickAddUser} />
        <Button name="Redeem" onClick={onOpenRedeem} disable={!playerInfo?.name}></Button>
      </div>
      <div className="p-4 border-b bg-yellow-300">
        {/* <DynamicInput /> */}
        <ListItem
          handleUpdateWheelItem={onClickCustomItems}
          handleOpenCreateNewItem={setIsOpenCreateNewItem}
        />
      </div>
      <EditableText initialText="Please input your rule here!" />
      <Dialog
        open={isOpenDialog}
        title="Ready to win big?"
        setOpen={setIsOpenDialog}
        actionButton={
          <div className="flex items-center gap-2 py-2">
            <Button
              name="Access my account"
              onClick={onClickAddAccount}
            ></Button>
            <Button
              name="Create account now"
              onClick={onClickCreateNewAccount}
            ></Button>
          </div>
        }
      >
        <div>Start collecting points and earning rewards!</div>
      </Dialog>
      <Dialog
        open={isAdd}
        title="Your account"
        setOpen={setIsAdd}
        actionButton={
          <div className="flex items-center gap-2 pt-4">
            <Button name="Cancel" onClick={onClickCancelAdd}></Button>
            <Button
              name="Add"
              onClick={submitGetUser(onClickGetUser)}
              isLoading={isLoading}
            ></Button>
          </div>
        }
      >
        <Input
          name="phone"
          type="text"
          placeholder="Please input your phone number!"
          register={registerGetUser}
          error={formStateGetUser.errors.phone?.message}
        />
      </Dialog>
      <Dialog
        open={isCreateNew}
        title="Your account"
        setOpen={setIsCreateNew}
        actionButton={
          <div className="flex items-center gap-2 pt-4">
            <Button name="Cancel" onClick={onClickCancelCreatNew}></Button>
            <Button
              name="Add"
              onClick={submitNewUser(onClickExecuteCreate)}
              isLoading={isLoadingCreateNewUser}
            ></Button>
          </div>
        }
      >
        <div>
          <Input
            className="pb-2"
            name="name"
            type="text"
            placeholder="Please input your name"
            register={registerNewUser}
            error={formStateNewUser.errors.name?.message}
          />
          <Input
            name="phoneNumber"
            type="text"
            placeholder="Please input your phone number"
            register={registerNewUser}
            error={formStateNewUser.errors.phoneNumber?.message}
          />
        </div>
      </Dialog>
      <Dialog
        open={isCustomItems}
        title="Update Items"
        setOpen={setIsCustomItems}
        actionButton={
          <div className="flex items-center gap-2 pt-4">
            <Button name="Cancel" onClick={onClickCancelCustomItems}></Button>
            <Button
              name="Update"
              onClick={handleSubmit(onSubmit)}
              isLoading={isPending}
            ></Button>
          </div>
        }
      >
        <div className="grid gap-3">
          <form>
            <Input
              label="Name"
              name="name"
              type="text"
              placeholder="Please input name!"
              register={register}
              error={formState.errors.name?.message}
            />
            <div className="flex w-full gap-2">
              <Input
                label="Value"
                name="value"
                type="text"
                placeholder="Please input value!"
                register={register}
                error={formState.errors.value?.message}
              />
              <Input
                label="Weight"
                name="weight"
                type="number"
                register={register}
              />
            </div>
            <Select
              label="Categories"
              name="categoryId"
              placeholder="Select category"
              register={register}
              options={[
                { value: "1", label: "point" },
                { value: "2", label: "gift" },
              ]}
            />
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Select color
              </label>
              <InputColor
                initialValue={selectedItem?.color || "#000000"}
                onChange={setColor}
                placement="right"
              />
            </div>
            <ImagePicker
              onImageChange={handleImageChange}
              defaultImage={selectedItem?.img}
              handleTakeFileImg={handleTakeFileImg}
            />
          </form>
        </div>
      </Dialog>
      <Redeem isOpen={isOpenRedeem} handleOpen={setIsOpenRedeem} />
    </div>
  );
}

export default AdminBoard;
