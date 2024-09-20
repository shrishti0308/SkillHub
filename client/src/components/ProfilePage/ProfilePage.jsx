import React, { useState } from 'react';
import { FaPlus } from '@react-icons/all-files/fa/FaPlus';
import { FaTimes } from '@react-icons/all-files/fa/FaTimes';

const ProfilePage = () => {
    const user = {
        name: 'Vegeta',
        email: 'prince.vegeta@saiyanmail.com',
        bio: 'The Prince of all Saiyans, determined to surpass Kakarot.',
        info: {
            skills: ['Combat Strategy', 'Super Saiyan', 'Energy Blast'],
            portfolio: 'https://vegeta-saiyan-elite.com',
            experience: ['Leader of Saiyan Army', 'Fighter in Tournament of Power']
        },
        previousWorks: [
            {
                title: 'Battle with Frieza',
                description: 'Fought against the tyrant Frieza on Namek, pushing my limits.',
                link: 'https://dragonball.com/frieza-saga'
            },
            {
                title: 'Tournament of Power',
                description: 'Represented Universe 7 and showcased my pride as a Saiyan warrior.',
                link: 'https://dragonball.com/tournament-of-power'
            }
        ],
    };

    const [formData, setFormData] = useState({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        skills: user.info?.skills || [''],
        portfolio: user.info?.portfolio || '',
        experience: user.info?.experience || [''],
        previousWorks: user.previousWorks || [{ title: '', description: '', link: '' }]
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleArrayChange = (index, e, fieldName) => {
        const updatedArray = [...formData[fieldName]];
        updatedArray[index] = e.target.value;
        setFormData({ ...formData, [fieldName]: updatedArray });
    };

    const handleAddField = (fieldName) => {
        const updatedArray = [...formData[fieldName], ''];
        setFormData({ ...formData, [fieldName]: updatedArray });
    };

    const handleDeleteField = (index, fieldName) => {
        const updatedArray = formData[fieldName].filter((_, i) => i !== index);
        setFormData({ ...formData, [fieldName]: updatedArray });
    };

    const handlePreviousWorksChange = (index, e, fieldName) => {
        const updatedWorks = [...formData.previousWorks];
        updatedWorks[index] = { ...updatedWorks[index], [fieldName]: e.target.value };
        setFormData({ ...formData, previousWorks: updatedWorks });
    };

    const handleAddPreviousWork = () => {
        const updatedWorks = [...formData.previousWorks, { title: '', description: '', link: '' }];
        setFormData({ ...formData, previousWorks: updatedWorks });
    };

    const handleDeletePreviousWork = (index) => {
        const updatedWorks = formData.previousWorks.filter((_, i) => i !== index);
        setFormData({ ...formData, previousWorks: updatedWorks });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Updated profile data:', formData);
    };

    return (
        <div className="max-w-5xl mx-auto p-6 bg-dark shadow-lg rounded-lg">
            <h1 className="text-4xl font-bold text-light pb-6 border-b-4 border-emerald">Profile Settings</h1>
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-6">
                <div className="flex flex-col">
                    <label className="text-lg font-semibold text-light">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-3 mt-1 bg-grey border border-gray-500 rounded-lg focus:ring-2 focus:ring-emerald focus:outline-none text-light"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-lg font-semibold text-light">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 mt-1 bg-grey border border-gray-500 rounded-lg focus:ring-2 focus:ring-emerald focus:outline-none text-light"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-lg font-semibold text-light">Bio</label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        maxLength="500"
                        className="w-full p-3 mt-1 bg-grey border border-gray-500 rounded-lg focus:ring-2 focus:ring-emerald focus:outline-none text-light"
                    />
                </div>

                {/* Skills Section */}
                <div className="flex flex-col">
                    <label className="text-lg font-semibold text-light">Skills</label>
                    <div className="flex flex-wrap gap-2">
                        {formData.skills.map((skill, index) => (
                            <div key={index} className="bg-gray-600 text-light p-2 rounded-full flex items-center">
                                {skill}
                                <button
                                    type="button"
                                    onClick={() => handleDeleteField(index, 'skills')}
                                    className="ml-2 text-red-500"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={() => handleAddField('skills')}
                        className="mt-3 flex items-center text-emerald hover:text-indigo-400"
                    >
                        <FaPlus className="mr-2" /> Add Skill
                    </button>
                </div>

                {/* Experience Section */}
                <div className="flex flex-col">
                    <label className="text-lg font-semibold text-light">Experience</label>
                    {formData.experience.map((exp, index) => (
                        <div key={index} className="flex items-center">
                            <input
                                type="text"
                                value={exp}
                                onChange={(e) => handleArrayChange(index, e, 'experience')}
                                className="w-full p-3 mt-1 bg-grey border border-gray-500 rounded-lg focus:ring-2 focus:ring-emerald focus:outline-none text-light"
                            />
                            <button
                                type="button"
                                onClick={() => handleDeleteField(index, 'experience')}
                                className="ml-2 text-red-500"
                            >
                                <FaTimes />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => handleAddField('experience')}
                        className="mt-3 flex items-center text-emerald hover:text-indigo-400"
                    >
                        <FaPlus className="mr-2" /> Add Experience
                    </button>
                </div>

                {/* Previous Works Section */}
                <div className="flex flex-col">
                    <label className="text-lg font-semibold text-light">Previous Works</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {formData.previousWorks.map((work, index) => (
                            <div key={index} className="bg-grey p-4 pt-2 rounded-lg shadow-lg space-y-2">
                                <div className='flex justify-end' >
                                    <button
                                        type="button"
                                        onClick={() => handleDeletePreviousWork(index)}
                                        className="text-red-500"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    value={work.title}
                                    onChange={(e) => handlePreviousWorksChange(index, e, 'title')}
                                    placeholder="Title"
                                    className="w-full p-3 bg-dark border border-gray-500 rounded-lg focus:ring-2 focus:ring-emerald focus:outline-none text-light"
                                />
                                <input
                                    type="text"
                                    value={work.description}
                                    onChange={(e) => handlePreviousWorksChange(index, e, 'description')}
                                    placeholder="Description"
                                    className="w-full p-3 bg-dark border border-gray-500 rounded-lg focus:ring-2 focus:ring-emerald focus:outline-none text-light"
                                />
                                <input
                                    type="text"
                                    value={work.link}
                                    onChange={(e) => handlePreviousWorksChange(index, e, 'link')}
                                    placeholder="Link"
                                    className="w-full p-3 bg-dark border border-gray-500 rounded-lg focus:ring-2 focus:ring-emerald focus:outline-none text-light"
                                />
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={handleAddPreviousWork}
                        className="mt-3 flex items-center text-emerald hover:text-indigo-400"
                    >
                        <FaPlus className="mr-2" /> Add Previous Work
                    </button>
                </div>

                {/* Portfolio Link */}
                <div className="flex flex-col">
                    <label className="text-lg font-semibold text-light">Portfolio</label>
                    <input
                        type="text"
                        name="portfolio"
                        value={formData.portfolio}
                        onChange={handleChange}
                        className="w-full p-3 bg-grey border border-gray-500 rounded-lg focus:ring-2 focus:ring-emerald focus:outline-none text-light"
                    />
                </div>

                {/* Update Profile Button */}
                <button
                    type="submit"
                    className="mt-6 w-1/2 mx-auto bg-gray-800 hover:bg-grey text-white font-bold py-3 rounded-lg shadow-lg transition duration-300"
                >
                    Update Profile
                </button>
            </form>
        </div>
    );
};

export default ProfilePage;
