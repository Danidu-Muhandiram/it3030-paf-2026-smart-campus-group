
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, PlusCircle, Building2 } from "lucide-react";

export const AddResourcePage = () => {
  const [resource, setResource] = useState({
    name: "",
    type: "",
    capacity: "",
    location: "",
    status: "ACTIVE",
    availabilityStart: "",
    availabilityEnd: "",
  });

  const handleChange = (e) => {
    setResource({
      ...resource,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Resource Data:", resource);

    // Later connect to backend
    // fetch("http://localhost:8080/resources", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(resource),
    // });
  };

  return (
    <div className="min-h-screen bg-bg-main flex justify-center items-center p-6">
      <div className="w-full max-w-xl bg-white shadow-md rounded-xl p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/resources"
            className="flex items-center gap-2 text-text-muted hover:text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </Link>

          <div className="flex items-center gap-2 text-primary font-semibold">
            <Building2 className="w-5 h-5" />
            Smart Campus
          </div>
        </div>

        <h1 className="text-2xl font-bold text-text-main mb-6">
          Add New Resource
        </h1>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>

          {/* Resource Name */}
          <div>
            <label className="text-sm font-medium text-text-muted">
              Resource Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Lab 1 / Lecture Hall A"
              value={resource.name}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          </div>

          {/* Resource Type */}
          <div>
            <label className="text-sm font-medium text-text-muted">
              Resource Type
            </label>
            <select
              name="type"
              value={resource.type}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            >
              <option value="">Select Type</option>
              <option value="ROOM">Room</option>
              <option value="LAB">Lab</option>
              <option value="EQUIPMENT">Equipment</option>
            </select>
          </div>

          {/* Capacity */}
          <div>
            <label className="text-sm font-medium text-text-muted">
              Capacity
            </label>
            <input
              type="number"
              name="capacity"
              placeholder="Enter capacity"
              value={resource.capacity}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          </div>

          {/* Location */}
          <div>
            <label className="text-sm font-medium text-text-muted">
              Location
            </label>
            <input
              type="text"
              name="location"
              placeholder="Building A / Floor 2"
              value={resource.location}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium text-text-muted">
              Status
            </label>
            <select
              name="status"
              value={resource.status}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="OUT_OF_SERVICE">OUT OF SERVICE</option>
            </select>
          </div>

          {/* Availability */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-text-muted">
                Available From
              </label>
              <input
                type="time"
                name="availabilityStart"
                value={resource.availabilityStart}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-text-muted">
                Available To
              </label>
              <input
                type="time"
                name="availabilityEnd"
                value={resource.availabilityEnd}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-lg mt-4 flex items-center justify-center gap-2 transition-all"
          >
            Add Resource
            <PlusCircle className="w-5 h-5" />
          </button>

        </form>
      </div>
    </div>
  );
};