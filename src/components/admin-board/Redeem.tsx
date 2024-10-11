import { GlobalContext } from '@/app/context';
import { useCreateRedeemGiftMutation } from '@/hooks/gifts/useCreateRedeemGift';
import { useDeleteRedeemGiftMutation } from '@/hooks/gifts/useDeleteRedeemGift';
import { useGetListGiftQuery } from '@/hooks/gifts/useGetListGift';
import { useRedeemPointHistoryMutation } from '@/hooks/gifts/useRedeemPointHistory';
import { useUpdateRedeemGiftMutation } from '@/hooks/gifts/useUpdateRedeemGift';
import { TRedeemGiftRequest, TRedeemPointRequest } from '@/types/gift';
import { FormatRedeemGiftList } from '@/utils/functions';
import { PencilSquareIcon, TrashIcon, XMarkIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';
import React, { useState, useRef, useEffect } from 'react';
import { useContext } from 'react';
import { useLayoutEffect } from 'react';
import toast from 'react-hot-toast';
import { Button } from '../button';
import { Dialog } from '../dialog';
import { Loader } from '../loader';

type Props = {
    isOpen: boolean,
    handleOpen: React.Dispatch<React.SetStateAction<boolean>>
};

type ButtonContent = {
    id: number,
    name: string;
    totalPoint: string;
};

function Redeem({ isOpen, handleOpen }: Props) {
    const [buttons, setButtons] = useState<ButtonContent[]>([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [isHolding, setIsHolding] = useState(false);
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [newGiftName, setNewGiftName] = useState<string>('');
    const [newGiftPoints, setNewGiftPoints] = useState<string>('');
    const [selectedGift, setSelectedGift] = useState<{ id: number, point: number } | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);

    const { playerInfo } = useContext(GlobalContext);

    const { data: listRedeemGift, isLoading } = useGetListGiftQuery()
    const { mutate: deleteRedeemGift } = useDeleteRedeemGiftMutation()
    const { mutate: updateRedeemGift } = useUpdateRedeemGiftMutation()
    const { mutate: createRedeemGift, isPending: isLoadingCreateRedeemGift } = useCreateRedeemGiftMutation()
    const { mutate: redeemPointHistory } = useRedeemPointHistoryMutation()

    const handleMouseDown = (index: number) => {
        setIsHolding(true);
        timeoutRef.current = setTimeout(() => {
            setHoveredIndex(index);
        }, 500);
    };

    const handleMouseUp = () => {
        setIsHolding(false);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    const handleMouseLeave = (index: number) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        if (!isHolding) {
            setHoveredIndex(null);
        }
    };

    const handleDelete = (id: number) => {
        deleteRedeemGift(id, {
            onSuccess: () => {
                setButtons(buttons.filter(button => button.id !== id));
                setHoveredIndex(null);
            },
            onError: (error: any) => {
                toast.error(error)
            }
        });
    };

    const handleCreateGift = () => {
        if (!newGiftName || !newGiftPoints) {
            return;
        }

        const newGift: TRedeemGiftRequest = {
            name: newGiftName,
            totalPoint: parseInt(newGiftPoints, 10)
        };

        createRedeemGift(newGift, {
            onSuccess: () => {
                setIsCreating(false);
                setNewGiftName('');
                setNewGiftPoints('');
                toast.success('Create redeem gift successfully!')
            },
            onError: (error: any) => {
                toast.error(error)
            }
        });
    };

    const handleRedeemPoints = (redeemGiftId: number, point: number) => {

        const redeemRequest: TRedeemPointRequest = {
            userId: playerInfo?.id ?? 0,
            point: point,
            redeemGiftId: redeemGiftId
        };

        redeemPointHistory(redeemRequest, {
            onSuccess: () => {
                toast.success("Points redeemed successfully!");
            },
            onError: (error: any) => {
                toast.error(error);
            }
        });
    };

    const handleEdit = (index: number) => {
        setEditingIndex(index);
    };

    const handleSave = (id: number, newName: string, newPoints: string) => {
        const updateData = {
            id,
            name: newName,
            totalPoint: parseInt(newPoints, 10)
        };

        updateRedeemGift(updateData, {
            onSuccess: () => {
                setEditingIndex(null);
            },
            onError: (error: any) => {
                console.error('Failed to update gift:', error);
                toast.error(error)
            }
        });
    };

    const handleGiftClick = (id: number, point: number) => {
        if ((playerInfo?.totalPoints ?? 0) >= point) {
            setSelectedGift({ id, point });
            setIsConfirmModalOpen(true);
        }
    };

    useEffect(() => {
        const handleGlobalMouseUp = () => {
            setIsHolding(false);
        };

        window.addEventListener('mouseup', handleGlobalMouseUp);

        return () => {
            window.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, []);

    useLayoutEffect(() => {
        if (listRedeemGift?.data) {
            const list = FormatRedeemGiftList(listRedeemGift.data);
            setButtons(list);
        }
    }, [listRedeemGift]);

    const ConfirmModal = () => {
        if (!selectedGift) return null;

        return (
            <Dialog open={isConfirmModalOpen} setOpen={setIsConfirmModalOpen}>
                <div className="p-4">
                    <h3 className="text-lg font-bold mb-4">Confirm Redeem</h3>
                    <p>Are you sure you want to redeem this gift for {selectedGift.point} points?</p>
                    <div className="flex justify-end mt-4">
                        <button
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
                            onClick={() => setIsConfirmModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={() => {
                                handleRedeemPoints(selectedGift.id, selectedGift.point);
                                setIsConfirmModalOpen(false);
                            }}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </Dialog>
        );
    };


    return (
        <div>
            <Dialog open={isOpen} setOpen={handleOpen}>
                <div>
                    <h2 className='flex right-0 font-semibold text-3xl justify-center mb-6'>Redeem</h2>
                    <div className="flex flex-col gap-3 mb-4">
                        {isLoading ? <Loader /> : buttons.map((button) => (
                            <div key={button.id} className="flex items-center gap-2 mb-2">
                                {editingIndex === button.id ? (
                                    <>
                                        <input
                                            value={button.name}
                                            onChange={(e) => setButtons(buttons.map(b => b.id === button.id ? { ...b, name: e.target.value } : b))}
                                            className="border rounded px-2 py-1 flex-grow"
                                        />
                                        <input
                                            value={button.totalPoint}
                                            onChange={(e) => setButtons(buttons.map(b => b.id === button.id ? { ...b, totalPoint: e.target.value } : b))}
                                            className="border rounded px-2 py-1 w-20"
                                            type="number"
                                        />
                                        <button
                                            onClick={() => handleSave(button.id, button.name, button.totalPoint)}
                                        >
                                            <CheckBadgeIcon className='w-4 h-4' />
                                        </button>
                                        <button
                                            onClick={() => setEditingIndex(null)}
                                        >
                                            <XMarkIcon className='w-4 h-4' />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            className={`border py-2 px-4 rounded-xl flex-grow flex justify-between hover:bg-gray-300 ${(playerInfo?.totalPoints ?? 0) < button.totalPoint ? 'opacity-50 cursor-not-allowed' : ''
                                                }`}
                                            onClick={() => handleGiftClick(button.id, +button.totalPoint)}
                                            disabled={(playerInfo?.totalPoints ?? 0) < button.totalPoint}
                                        >
                                            <span>{button.name}</span>
                                            <span>{button.totalPoint}</span>
                                        </button>
                                        <button
                                            onClick={() => handleEdit(button.id)}
                                        >
                                            <PencilSquareIcon className='w-4 h-4' />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(button.id)}
                                        >
                                            <TrashIcon className='w-4 h-4' />
                                        </button>
                                    </>
                                )}
                            </div>
                        ))}
                        {isCreating && (
                            <div className="flex justify-between items-center gap-2">
                                <input
                                    value={newGiftName}
                                    onChange={(e) => setNewGiftName(e.target.value)}
                                    placeholder="Gift name"
                                    className="border rounded px-2 py-1 flex-grow"
                                />
                                <input
                                    value={newGiftPoints}
                                    onChange={(e) => setNewGiftPoints(e.target.value)}
                                    placeholder="Points"
                                    type="number"
                                    className="border rounded px-2 py-1 w-1/4"
                                />
                                <button
                                    onClick={handleCreateGift}
                                    className="bg-green-500 text-white px-2 py-1 rounded"
                                    disabled={isLoadingCreateRedeemGift}
                                >
                                    {isLoadingCreateRedeemGift ? 'Creating...' : 'Create'}
                                </button>
                            </div>
                        )}
                    </div>
                    <div className='w-full flex justify-end'>
                        <Button name={isCreating ? 'Cancel' : 'Add'} onClick={() => setIsCreating(!isCreating)}></Button>
                    </div>
                </div>
            </Dialog>
            <ConfirmModal />
        </div>
    );
}

export default Redeem;

