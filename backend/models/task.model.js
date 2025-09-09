import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    priority: {
        type: String,
        enum: ['Urgent', 'not urgent'],
        default: 'not urgent',
    },
    due: {
        type: Date,
        default: new Date().toISOString(),
    },
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Completed'],
        default: 'Open',
    }
},
{
    timestamps: true
}
);

const Task = mongoose.model("Task", taskSchema);

export default Task;