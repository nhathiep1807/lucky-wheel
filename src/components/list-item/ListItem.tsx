import React from "react";
import { useGetListWheelItemQuery } from "@/hooks/wheel-items/useGetListWheelItem";
import {
  QueueListIcon,
  XCircleIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { useDeleteWheelItemMutation } from "@/hooks/wheel-items/useDeleteWheelItem";
import toast from "react-hot-toast";
import { TypeErrorResponse } from "@/types/common";
import { Loader } from "../loader";
import { TCreateWheelItemResponse } from "@/types/wheelItems";

type Props = {
  handleUpdateWheelItem: (item: TCreateWheelItemResponse) => void;
};

function ListItem({ handleUpdateWheelItem }: Props) {
  const { data: listWheelItems, isLoading } = useGetListWheelItemQuery();
  const { mutate: deleteWheelItem } = useDeleteWheelItemMutation();

  const onDeleteWheelItem = (id: number) => {
    deleteWheelItem(id.toString(), {
      onSuccess: () => {
        toast.success("Delete wheel item completed!");
      },
      onError: (error: any) => {
        const _error: TypeErrorResponse = error;
        toast.error(error);
      },
    });
  };
  return (
    <div>
      <div className="flex items-center gap-1 py-2">
        <QueueListIcon className="w-5 h-5" />
        <span className="font-semibold">List Item</span>
      </div>
      <div className="relative border max-h-[400px] min-h-[400px] overflow-y-auto">
        {isLoading ? (
          <Loader className="absolute top-1/2 left-1/2" />
        ) : (
          <div>
            {listWheelItems?.data.map((item, _index) => (
              <div
                key={item.id}
                className="m-4 pb-1 border-b flex justify-between"
              >
                <div className="px-4 flex items-center gap-1">
                  {item.img && (
                    <img
                      src={item.img}
                      alt="item"
                      className="w-10 h-10 object-contain"
                    />
                  )}
                  <p>{item.name}</p>
                </div>
                <div className="px-2 flex gap-4">
                  <button onClick={() => handleUpdateWheelItem(item)}>
                    <PencilSquareIcon className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDeleteWheelItem(item.id)}>
                    <XCircleIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ListItem;
