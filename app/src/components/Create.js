import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

const Create = ({ uploadToPinata, createFund }) => {
    const [file, setFile] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [deadline, setDeadline] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const { getRootProps, getInputProps } = useDropzone({
        accept: { 'image/*': [] },
        onDrop: (acceptedFiles) => {
            setFile(acceptedFiles[0]);
        },
    });

    const clearImage = () => setFile(null);

    const handleMint = async () => {
        if (!file || !name || !description || !targetAmount || !deadline) {
            alert('Please complete all fields');
            return;
        }

        setIsCreating(true);

        try {
            const now = Math.floor(Date.now() / 1000);
            const deadlineSec = Math.floor(new Date(deadline).getTime() / 1000);
            const deadlineNano = deadlineSec * 1_000_000_000;

            if (deadlineSec <= now) {
                alert('Deadline must be in the future.');
                return;
            }

            const ipfsHash = await uploadToPinata(file);
            await createFund(ipfsHash, name, description, targetAmount, deadlineNano);
            clearImage();
        } catch (e) {
            console.error(e);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-start px-4 py-12 bg-[#00000] text-white">
            <div className="w-full max-w-6xl bg-[#1e293b] rounded-3xl shadow-xl p-8 flex flex-col md:flex-row gap-10">
                
                {/* Upload Section */}
                <div className="w-full md:w-1/3 flex flex-col items-center gap-4">
                    <div
                        {...getRootProps()}
                        className="w-full border-2 border-dashed border-blue-400 hover:border-blue-600 transition rounded-lg p-4 cursor-pointer flex justify-center items-center h-64 bg-[#0f172a]"
                    >
                        <input {...getInputProps()} />
                        {file ? (
                            <img
                                src={URL.createObjectURL(file)}
                                alt="Preview"
                                className="rounded-lg max-h-52 object-cover"
                            />
                        ) : (
                            <p className="text-blue-300 text-center">Drag & drop an image, or click to select</p>
                        )}
                    </div>
                    {file && (
                        <button
                            onClick={clearImage}
                            className="bg-red-500 hover:bg-red-600 transition px-4 py-2 rounded-lg text-white font-medium"
                        >
                            Clear Image
                        </button>
                    )}
                </div>

                {/* Form Section */}
                <div className="w-full md:w-2/3 space-y-5">
                    <h2 className="text-3xl font-bold text-center md:text-left">Create Your Fund</h2>

                    <div>
                        <label className="block mb-1">Title</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter Fund Title"
                            className="w-full p-3 bg-[#0f172a] border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block mb-1">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe your fund"
                            className="w-full p-3 h-32 resize-none bg-[#0f172a] border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1">Target Amount</label>
                            <input
                                type="number"
                                value={targetAmount}
                                onChange={(e) => setTargetAmount(e.target.value)}
                                placeholder="Amount (NEAR)"
                                className="w-full p-3 bg-[#0f172a] border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block mb-1">Deadline</label>
                            <input
                                type="datetime-local"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                min={new Date().toISOString().slice(0, 16)}
                                className="w-full p-3 bg-[#0f172a] border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex justify-center md:justify-end pt-4">
                        <button
                            onClick={handleMint}
                            disabled={isCreating}
                            className={`px-6 py-3 font-semibold rounded-lg text-white transition ${
                                isCreating
                                    ? 'bg-gray-600 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-purple-600'
                            }`}
                        >
                            {isCreating ? 'Creating...' : 'Create Fund'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Create;
