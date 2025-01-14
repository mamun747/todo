"use client";
import React, { useEffect, useState } from "react";
interface IData {
  id: number | undefined;
  task: string;
  complete: boolean;
}
function MainArea() {
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const [tasks, setTasks] = useState<string>("");
  const [showTasks, setShowTasks] = useState<IData[]>([]);
  const [editingText, setEditingText] = useState<string>("");
  const [editinId, setEditingId] = useState(null);
  const [search, setSearch] = useState<string>("");
  const [draggedItem, setDraggedItem] = useState<IData | null>(null);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  useEffect(() => {
    const savedItems = localStorage.getItem("item");
    if (savedItems) {
      setShowTasks(JSON.parse(savedItems));
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("item", JSON.stringify(showTasks));
  }, [showTasks]);
  const handleAdd = () => {
    if (tasks.trim() === "") return;
    setShowTasks((prev) => [
      ...prev,
      { id: new Date().getTime(), task: tasks, complete: false },
    ]);
    if (tasks === "") return;
    setTasks("");
  };
  const handleEdit = (id: number) => {
    const taskToEdit = showTasks.find((task) => task.id === id);
    if (taskToEdit) {
      setEditingText(taskToEdit.task);
      setEditingId(id);
    }
  };
  const handleSave = (e: number) => {
    setShowTasks((prev) =>
      prev.map((task) =>
        task.id === e ? { ...task, task: editingText } : task
      )
    );
    setEditingId(null);
    setEditingText("");
  };
  const handleCancel = (id: number) => {
    setEditingId(null);
  };
  const handleDelete = (id: number) => {
    setShowTasks((prev) => prev.filter((value) => value.id !== id));
  };
  const handleComplete = (id: number) => {
    setShowTasks((prev) =>
      prev.map((value) =>
        value.id === id ? { ...value, complete: true } : value
      )
    );
  };
  const handleFullScreen = () => {
    setFullscreen(true);
    document.body.requestFullscreen();
  };
  const handleExitScreen = () => {
    setFullscreen(false);
    document.exitFullscreen();
  };
  const onSearch = (e: string) => {
    setSearch(e);
  };

  const filteredTasks = showTasks.filter((value) =>
    value.task.toLowerCase().includes(search.toLowerCase())
  );
  const completedTasks = () => {
    setShowTasks((prev) => prev.filter((value) => value.complete === true));
  };

  const onDragStart = (e: React.DragEvent, value: IData) => {
    setDraggedItem(value);
  };
  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDraggedItemIndex(index);
  };
  const onDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItem) {
      const cloneArr = [...showTasks];
      const updatedArr = cloneArr.findIndex(
        (task) => task.id === draggedItem.id
      );
      cloneArr.splice(updatedArr, 1);
      cloneArr.splice(index, 0, draggedItem);
      setShowTasks(cloneArr);
      setDraggedItem(null);
      setDraggedItemIndex(null);
    }
  };
  return (
    <>
      <section className="pt-10 px-5">
        <div className="max-w-md relative">
          <div className="absolute -right-32 top-20 text-lg">Total Tasks: <span className="font-semibold">{filteredTasks.length}</span></div>
          <div className="flex gap-5 md:flex-row flex-col">
            <input
              type="text"
              className="flex-1 w-[300px] rounded-2xl border outline-none px-2 py-1 text-gray-600"
              placeholder="Add Your Daily Tasks....."
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
              autoFocus
            />
            <button
              className="uppercase font-mono text-lg px-3 py-1 text-white shadow-lg active:translate-y-0.5 bg-slate-400/70 rounded-md"
              onClick={handleAdd}
            >
              add
            </button>
            {fullscreen ? (
              <button
                className="uppercase font-mono px-1 text-lg py-1 text-white shadow-lg active:translate-y-0.5 bg-slate-400/70 rounded-md"
                onClick={handleExitScreen}
              >
                exit fullscreen
              </button>
            ) : (
              <button
                className="uppercase font-mono text-lg px-3 py-1 text-white shadow-lg active:translate-y-0.5 bg-slate-400/70 rounded-md"
                onClick={handleFullScreen}
              >
                fullscreen
              </button>
            )}
            <button
              className="uppercase font-mono text-lg px-3 py-1 text-white shadow-lg active:translate-y-0.5 bg-slate-400/70 rounded-md flex-1 relative group"
              onClick={completedTasks}
            >
              completed
              <span className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 text-xs text-white bg-red-500 px-1 py-1 rounded opacity-0 group-hover:opacity-100 transition-all invisible group-hover:visible w-64">
                Note: if once select it you just can see your completed tasks but your all incompleted tasks will be gone. So be careful!
              </span>
            </button>
          </div>
          {/* <div className="flex gap-2 items-center mt-3"> */}
          <input
            type="text"
            placeholder="Search tasks...."
            className="mt-3 border px-4 py-2 rounded-full outline-none focus:ring-blue-500 focus:border-blue-300 w-full flex-1 transition-all"
            onChange={(e) => onSearch(e.target.value)}
          />
          <div className="mt-5 rounded-md">
            {filteredTasks.length === 0 ? (
              <p className="text-base text-slate-400 ps-20 md:ps-32">
                Your Task is Empty
              </p>
            ) : (
              filteredTasks.map((value, index) => (
                <div
                  key={value.id}
                  className={`flex justify-between bg-slate-100/60 px-2 items-center mb-2 cursor-move ${
                    draggedItemIndex === index ? "bg-slate-300" : ""
                  } `}
                  draggable
                  onDragStart={(e) => onDragStart(e, value)}
                  onDragOver={(e) => onDragOver(e, index)}
                  onDrop={(e) => onDrop(e, index)}
                >
                  {/* If editing, show input field; otherwise show task text */}
                  {editinId === value.id ? (
                    <>
                      <input
                        type="text"
                        className="flex-1 border rounded px-2 py-1 mr-2"
                        onChange={(e) => setEditingText(e.target.value)}
                      />
                      <button
                        className="bg-green-400 font-semibold px-2 py-1 text-white rounded-md mr-2"
                        onClick={() => handleSave(value.id)}
                      >
                        Save
                      </button>
                      <button
                        className="bg-red-400 font-semibold px-2 py-1 text-white rounded-md"
                        onClick={() => handleCancel(value.id)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <h1
                        className={`text-lg capitalize mt-1 p-1 ${
                          value.complete
                            ? "line-through text-gray-400"
                            : "no-underline"
                        }`}
                      >
                        {value.task}
                      </h1>
                      <div className="flex gap-2">
                        <button
                          className="bg-red-300 px-2 text-white rounded-md font-semibold"
                          onClick={() => handleEdit(value.id)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-300 px-2 text-white rounded-md font-semibold"
                          onClick={() => handleDelete(value.id)}
                        >
                          Delete
                        </button>
                        <button
                          className="bg-red-300 px-2 text-white rounded-md font-semibold"
                          onClick={() => handleComplete(value.id)}
                        >
                          Complete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default MainArea;
