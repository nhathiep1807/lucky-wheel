import React, { useEffect, useState } from "react";
import { useGetListWheelItemQuery } from "@/hooks/wheel-items/useGetListWheelItem";
import {
  QueueListIcon,
  XCircleIcon,
  PencilSquareIcon,
  PlusIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import { useDeleteWheelItemMutation } from "@/hooks/wheel-items/useDeleteWheelItem";
import toast from "react-hot-toast";
import { TypeErrorResponse } from "@/types/common";
import { Loader } from "../loader";
import { TCreateWheelItemResponse } from "@/types/wheelItems";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useReorderWheelItemMutation } from "@/hooks/wheel-items/useReorderWheelItems";

type Props = {
  handleUpdateWheelItem: (item: TCreateWheelItemResponse) => void;
  handleOpenCreateNewItem: React.Dispatch<React.SetStateAction<boolean>>;
};

const reorder = (
  list: TCreateWheelItemResponse[],
  startIndex: number,
  endIndex: number
) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

function ListItem({ handleUpdateWheelItem, handleOpenCreateNewItem }: Props) {
  const { data: listWheelItems, isLoading } = useGetListWheelItemQuery();
  const { mutate: deleteWheelItem } = useDeleteWheelItemMutation();
  const { mutate: reorderWheelItem } = useReorderWheelItemMutation();

  const [needToSync, setNeedToSync] = useState(false);
  const [listItems, setListItems] = useState<TCreateWheelItemResponse[]>([]);

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

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }
    const newList = reorder(
      listItems,
      result.source.index,
      result.destination.index
    );

    setNeedToSync(newList.findIndex((p, i) => p.order !== i + 1) !== -1);
    setListItems(newList);
  };

  const handleReorder = () => {
    const payload = listItems.map((item, index) => ({
      id: item.id,
      order: index + 1,
    }));

    reorderWheelItem(payload, {
      onSuccess: () => {
        toast.success("Save changes successfully!");
        setNeedToSync(false);
      },
      onError: (error: any) => {
        const _error: TypeErrorResponse = error;
        toast.error(error);
      },
    });
  };

  useEffect(() => {
    setListItems(listWheelItems?.data || []);
  }, [listWheelItems?.data]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div>
        <div className="flex items-center gap-1 py-2">
          <QueueListIcon className="w-5 h-5" />
          <span className="font-semibold">List Item</span>
          {needToSync && (
            <button
              className="px-2 border-green-500 border rounded-md text-sm ml-auto hover:bg-green-500 hover:text-white transition-all duration-300"
              onClick={handleReorder}
            >
              Save
            </button>
          )}
        </div>

        <div className="relative border">
          {isLoading ? (
            <Loader className="absolute top-1/2 left-1/2" />
          ) : (
            <Droppable droppableId="droppable">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className=""
                >
                  {listItems.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="p-4 border-b flex justify-between bg-white"
                        >
                          <div className="flex items-center gap-1">
                            <ChevronUpDownIcon className="w-4 h-4 mr-2" />
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
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          )}

          <div
            className="w-full h-10 sticky bottom-0 left-0 bg-gray-100 flex justify-center items-center cursor-pointer gap-1"
            onClick={() => handleOpenCreateNewItem(true)}
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add Item</span>
          </div>
        </div>
      </div>
    </DragDropContext>
  );
}

export default ListItem;
