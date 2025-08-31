"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EmojiPicker from "emoji-picker-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/utils/dbConfig";
import { Incomes } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

function CreateIncomes({ refreshData }) {
  const [emojiIcon, setEmojiIcon] = useState("😀");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const { user } = useUser();

  /**
   * Used to Create New Income Source
   */
  const onCreateIncomes = async () => {
    const result = await db
      .insert(Incomes)
      .values({
        name: name,
        amount: amount,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        icon: emojiIcon,
      })
      .returning({ insertedId: Incomes.id });

    if (result) {
      refreshData();
      toast.success("New Income Source Created!");
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <div
            className="bg-slate-100 p-10 rounded-2xl
            items-center flex flex-col border-2 border-dashed
            cursor-pointer hover:shadow-md transition"
          >
            <h2 className="text-3xl">+</h2>
            <h2 className="font-medium">Create New Income Source</h2>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Create New Income Source
            </DialogTitle>
            <DialogDescription asChild>
              <div className="mt-4 space-y-4">
                {/* Emoji Picker Button */}
                <div className="relative">
                  <Button
                    variant="outline"
                    className="text-lg"
                    onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
                  >
                    {emojiIcon}
                  </Button>
                  {openEmojiPicker && (
                    <div className="absolute z-20 mt-2">
                      <EmojiPicker
                        onEmojiClick={(e) => {
                          setEmojiIcon(e.emoji);
                          setOpenEmojiPicker(false);
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Source Name */}
                <div>
                  <h2 className="text-gray-700 dark:text-gray-200 font-medium mb-1">
                    Source Name
                  </h2>
                  <Input
                    placeholder="e.g. Youtube"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {/* Monthly Amount */}
                <div>
                  <h2 className="text-gray-700 dark:text-gray-200 font-medium mb-1">
                    Monthly Amount
                  </h2>
                  <Input
                    type="number"
                    placeholder="e.g. 5000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                disabled={!(name && amount)}
                onClick={onCreateIncomes}
                className="mt-6 w-full rounded-full bg-green-600 hover:bg-green-700 text-white"
              >
                Create Income Source
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateIncomes;
