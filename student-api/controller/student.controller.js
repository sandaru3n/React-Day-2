import { prisma } from "../lib/prisma.js";

const BRANCHES = {
    b1: "Downtown Campus",
    b2: "Westside Center",
    b3: "Northgate Branch",
    b4: "Eastpark Hub",
    b5: "Southside Studio",
    b6: "Harbor View",
}

const formatStudent = (student, overrides = {}) => ({
    id: student.id,
    name: student.full_name,
    email: student.email,
    phone: student.phone,
    course: student.course,
    branchId: student.Branch,
    branch: overrides.branch ?? BRANCHES[student.Branch],
    age: student.age,
    avatar: student.full_name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    status: overrides.status ?? "active",
    paymentStatus: overrides.paymentStatus ?? "pending",
    enrollDate: overrides.enrollDate ?? "—",
})

export const CreateStudent = async (req, res) => {
    try {
        const { name, age, email, phone, course, branchId } = req.body;

        await prisma.student.create({
            data:{
                full_name: name,
                age,
                email,
                phone,
                course: course || "General",
                Branch: branchId
            }
        })


        return res.status(201).json({
            success: true,
            message: "Student created successfully",
            
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};


export const GetStudents = async (req, res) => {
    try {
        const students = await prisma.student.findMany({
            orderBy: { id: "desc" },
        })

        return res.status(200).json({
            success: true,
            message: "Students fetched successfully",
            data: students.map(formatStudent),
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}


export const UpdateStudent = async (req, res) => {
    try {
        const { id } = req.params
        const { name, age, email, course, status, paymentStatus, branchId } = req.body

        const student = await prisma.student.update({
            where: { id: parseInt(id) },
            data: {
                full_name: name,
                age,
                email,
                course: course || "General",
                Branch: branchId,
            },
        })

        return res.status(200).json({
            success: true,
            message: "Student updated successfully",
            data: formatStudent(student, {
                status,
                paymentStatus,
                branch: BRANCHES[branchId] || branchId,
            }),
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}


export const DeleteStudent = async (req, res) => {
    try {
        const { id } = req.params

        await prisma.student.delete({
            where: { id: parseInt(id) },
        })

        return res.status(200).json({
            success: true,
            message: "Student deleted successfully",
        })

    } catch (error) {
        console.error(error);

        if (error.code === "P2025") {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}