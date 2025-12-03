/**
 * Report Card View Component
 * Displays a printable report card
 */

import React from 'react';
import QRCode from 'react-qr-code';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const ReportCardView = ({ reportCard, onClose }) => {
    if (!reportCard) return null;

    const {
        student_name,
        student_code,
        class_name,
        period_name,
        school_year,
        overall_average,
        class_average,
        rank,
        total_students,
        subjects = [],
        appreciation
    } = reportCard;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto print:bg-white print:static print:block">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl m-4 print:shadow-none print:m-0 print:w-full print:max-w-none">

                {/* Toolbar (Hidden when printing) */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200 print:hidden">
                    <h2 className="text-lg font-bold text-gray-800">Aperçu du Bulletin</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => window.print()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Imprimer
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Fermer
                        </button>
                    </div>
                </div>

                {/* Report Card Content */}
                <div className="p-8 print:p-0" id="report-card-content">

                    {/* Header */}
                    <div className="text-center mb-8 border-b-2 border-gray-800 pb-4">
                        <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">École Démo Haïti</h1>
                        <p className="text-gray-600">123 Rue de l'École, Port-au-Prince, Haïti</p>
                        <p className="text-gray-600">Tél: +509 1234-5678 | Email: contact@ecoledemo.ht</p>
                        <h2 className="text-2xl font-bold mt-4 uppercase bg-gray-100 py-2">Bulletin Scolaire</h2>
                    </div>

                    {/* Student Info */}
                    <div className="grid grid-cols-2 gap-8 mb-8">
                        <div className="space-y-2">
                            <div className="flex">
                                <span className="font-bold w-32">Élève:</span>
                                <span className="uppercase">{student_name}</span>
                            </div>
                            <div className="flex">
                                <span className="font-bold w-32">Matricule:</span>
                                <span>{student_code}</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex">
                                <span className="font-bold w-32">Classe:</span>
                                <span>{class_name}</span>
                            </div>
                            <div className="flex">
                                <span className="font-bold w-32">Période:</span>
                                <span>{period_name}</span>
                            </div>
                            <div className="flex">
                                <span className="font-bold w-32">Année:</span>
                                <span>{school_year}</span>
                            </div>
                        </div>
                    </div>

                    {/* Grades Table */}
                    <table className="w-full border-collapse border border-gray-800 mb-8">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-800 p-2 text-left">Matière</th>
                                <th className="border border-gray-800 p-2 text-center w-20">Moy.</th>
                                <th className="border border-gray-800 p-2 text-center w-16">Coef.</th>
                                <th className="border border-gray-800 p-2 text-center w-20">Total</th>
                                <th className="border border-gray-800 p-2 text-center w-20">Rang</th>
                                <th className="border border-gray-800 p-2 text-left">Appréciation</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjects.map((sub, index) => (
                                <tr key={index}>
                                    <td className="border border-gray-800 p-2 font-medium">{sub.subject_name}</td>
                                    <td className="border border-gray-800 p-2 text-center">{sub.subject_average}</td>
                                    <td className="border border-gray-800 p-2 text-center">{sub.coefficient}</td>
                                    <td className="border border-gray-800 p-2 text-center font-bold">
                                        {(parseFloat(sub.subject_average) * parseFloat(sub.coefficient)).toFixed(2)}
                                    </td>
                                    <td className="border border-gray-800 p-2 text-center">{sub.rank_in_subject || '-'}</td>
                                    <td className="border border-gray-800 p-2 text-sm italic">{sub.appreciation || ''}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Performance Chart */}
                    <div className="mb-8 h-64 print:h-48">
                        <h3 className="font-bold mb-4">Analyse de Performance</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={subjects}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="subject_code" />
                                <YAxis domain={[0, 20]} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="subject_average" name="Élève" fill="#2563eb" />
                                <Bar dataKey="class_subject_average" name="Classe" fill="#9ca3af" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Summary */}
                    <div className="flex justify-end mb-8">
                        <div className="w-1/2 border border-gray-800">
                            <div className="grid grid-cols-2 border-b border-gray-800">
                                <div className="p-2 font-bold bg-gray-100 border-r border-gray-800">Moyenne Générale</div>
                                <div className="p-2 text-center font-bold text-xl">{overall_average} / 20</div>
                            </div>
                            <div className="grid grid-cols-2 border-b border-gray-800">
                                <div className="p-2 font-bold bg-gray-100 border-r border-gray-800">Rang</div>
                                <div className="p-2 text-center">{rank} / {total_students}</div>
                            </div>
                            <div className="grid grid-cols-2">
                                <div className="p-2 font-bold bg-gray-100 border-r border-gray-800">Moyenne Classe</div>
                                <div className="p-2 text-center">{class_average} / 20</div>
                            </div>
                        </div>
                    </div>

                    {/* Signatures */}
                    <div className="grid grid-cols-3 gap-8 mt-16">
                        <div className="text-center">
                            <p className="font-bold mb-16">Signature des Parents</p>
                            <div className="border-t border-gray-400 mx-8"></div>
                        </div>
                        <div className="text-center">
                            <p className="font-bold mb-16">L'Enseignant(e)</p>
                            <div className="border-t border-gray-400 mx-8"></div>
                        </div>
                        <div className="text-center">
                            <p className="font-bold mb-16">La Direction</p>
                            <div className="border-t border-gray-400 mx-8"></div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center text-xs text-gray-500 mt-12">
                        <p>Bulletin généré le {new Date().toLocaleDateString()} via School Management System</p>
                        <div className="mt-4 flex justify-center">
                            <div className="p-2 bg-white">
                                <QRCode
                                    value={`https://school-app.com/verify/report-card/${reportCard.id || 'demo'}`}
                                    size={64}
                                />
                            </div>
                        </div>
                        <p className="mt-1 text-[10px]">Scan pour vérifier l'authenticité</p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ReportCardView;
