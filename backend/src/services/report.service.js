import Report from "../models/report.model.js";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import { PORT, HOST } from "../config/configEnv.js";

import { handleError } from "../utils/errorHandler.js";

async function createReport(report){
    try {
        const {
            reportType,
            contentReport,
            userReport,
            postReport
        } = report;

        const existingReport = await Report.findOne({ userReport, postReport }).exec();
        if (existingReport) {
            return [null, "El usuario ya ha reportado esta publicación"];
        }

        const userFound = await User.findById(userReport).exec();
        if (!userFound) return [null, "Usuario no encontrado"];

        const postFound = await Post.findById(postReport).exec();
        if (!postFound) return [null, "Publicación no encontrada"];

        const newReport = new Report({
            reportType,
            contentReport,
            userReport,
            postReport
        });

        await newReport.save();
        return [newReport, null];
    } catch (error) {
        handleError(error, "report.service -> createReport");
        return [null, error.message];
    }
}


async function getReports() {
    try {
        const reports = await Report.find()
            .populate("userReport")
            .populate({
                path: 'postReport',
                populate: {
                    path: 'author',
                    select: '_id name'
                }
            })
            .exec();

        if (!reports) return [null, "No se encontraron reportes en la bbdd"];

        const formattedReports = reports.map(report => {
            const post = report.postReport;
            const formattedReports = post ? {
                ...post.toObject(),
                images: post.images ? post.images.map(imageName => `${HOST}${PORT}/uploads/images/${imageName}`) : []
            } : null;
            return {
                ...report.toObject(),
                postReport: formattedReports
            };
        }
        );
        return [formattedReports, null];
    } catch (error) {
        handleError(error, "report.service -> getReports");
    }
}


async function getReport(id){
    try {
        const report = await Report.findById(id)
        .populate("userReport")
        .populate("postReport")
        .exec();
        if(!report) return [null, "Reporte no encontrado"];
        return [report, null];
    } catch (error) {
        handleError(error, "report.service -> getReport")
    }
}

async function updateReport(id, report){
    try {
        const {
            userReport,
            postReport
        } = report;
        const reportFound = await Report.findById(id);
        if(!reportFound) return [null, "Reporte no encontrado"];
        const userFound = await User.findById(userReport);
        if(!userFound) return [null, "Usuario no encontrado"];
        const postFound = await Post.findById(postReport);
        if(!postFound) return [null, "Publicacion no encontrada"];
        await Report.findByIdAndUpdate(id, report);
        return [report, null];
    } catch (error) {
        handleError(error, "report.service -> updateReport")
    }
}

async function deleteReport(id){
    try {
        const reportFound = await Report.findById(id);
        if(!reportFound) return [null, "Reporte no encontrado"];
        await Report.findByIdAndDelete(id);
        return [reportFound, null];
    } catch (error) {
        handleError(error, "report.service -> deleteReport")
    }
}

async function getReportsByUser(id){
    try {
        const reports = await Report.find({ userReport: id })
        .populate("userReport")
        .populate("postReport")
        .exec();
        if(!reports) return [null, "No se encontraron reportes en la bbdd"];
        return [reports, null];
    } catch (error) {
        handleError(error, "report.service -> getReportsByUser")
    }
}

async function getReportsByPost(id){
    try {
        const reports = await Report.find({ postReport: id })
        .populate("userReport")
        .populate("postReport")
        .exec();
        if(!reports) return [null, "No se encontraron reportes en la bbdd"];
        return [reports, null];
    } catch (error) {
        handleError(error, "report.service -> getReportsByPost")
    }
}

async function getReportsByType(reportType){
    try {
        const reports = await Report.find({ reportType })
        .populate("userReport")
        .populate("postReport")
        .exec();
        if(!reports) return [null, "No se encontraron reportes en la bbdd"];
        return [reports, null];
    } catch (error) {
        handleError(error, "report.service -> getReportsByType")
    }
}

async function updateReportStatus(id, newStatus, reviewNotes) {
    try {
        const reportFound = await Report.findById(id);
        if(!reportFound) return [null, "Reporte no encontrado"];

        if(!['pendiente', 'en revision', 'resuelto', 'rechazado', 'en espera', 'cerrado']){
            return [null, "Estado no valido"];
        }
        const updatedReport = await Report.findByIdAndUpdate(id, {
            statusReport: newStatus,
            reviewNotes
        }, { new: true });
        return [updatedReport, null];
    } catch (error) {
        handleError(error, "report.service -> updateReportStatus")
        return [null, error];
    }
}



export default {
    createReport,
    getReports,
    getReport,
    updateReport,
    deleteReport,
    getReportsByUser,
    getReportsByPost,
    getReportsByType, 
    updateReportStatus
};
