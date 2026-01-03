import React from 'react';
import { X, CheckCircle, XCircle, Clock } from 'lucide-react';
import { ReferralApplication } from '../../types';

interface ReferralDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    application: ReferralApplication | null;
}

const ReferralDetailsModal: React.FC<ReferralDetailsModalProps> = ({
    isOpen,
    onClose,
    application,
}) => {
    if (!isOpen || !application) return null;

    // Debug: Log the application data to see what's coming from the API
    console.log('Application Details:', application);

    // Handle nested referralCodeData structure from API
    // The API returns: referralCodeData: { code: 'XXX', discountPercentage: 10, isActive: true }
    const referralCodeData = (application as any).referralCodeData;

    const referralCode = referralCodeData?.code
        || (application as any).approvedCode
        || (application as any).referralCode
        || (application as any).code
        || null;

    const discount = referralCodeData?.discountPercentage
        || (application as any).discountPercentage
        || (application as any).discount
        || (application as any).percentage
        || null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved': return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'rejected': return <XCircle className="w-5 h-5 text-red-600" />;
            default: return <Clock className="w-5 h-5 text-yellow-600" />;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-lg w-full shadow-xl">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        {getStatusIcon(application.status)}
                        <h3 className="text-xl font-bold text-gray-900">Application Details</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 transition-colors p-1 rounded-full hover:bg-gray-100"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Applicant Info */}
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Applicant</p>
                            <p className="text-base font-medium text-gray-900">{application.fullName}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Platform</p>
                                <p className="text-sm text-gray-900">{application.platform}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Handle</p>
                                <p className="text-sm text-gray-900">{application.socialMediaHandle}</p>
                            </div>
                        </div>
                    </div>

                    {/* Decision Details */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 text-sm border-b pb-2">Review Decision</h4>

                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600">Status:</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(application.status)}`}>
                                {application.status}
                            </span>
                        </div>

                        {application.status === 'approved' && (
                            <div className="grid grid-cols-2 gap-4 bg-green-50 p-4 rounded-lg border border-green-100">
                                <div>
                                    <p className="text-xs font-semibold text-green-800 uppercase tracking-wider">Referral Code</p>
                                    <p className="text-lg font-mono font-bold text-green-900 mt-1">
                                        {referralCode || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-green-800 uppercase tracking-wider">Discount</p>
                                    <p className="text-lg font-bold text-green-900 mt-1">
                                        {discount ? `${discount}%` : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        )}

                        {application.adminNotes && (
                            <div>
                                <p className="text-sm font-semibold text-gray-700 mb-1">Admin Message / Notes</p>
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{application.adminNotes}</p>
                                </div>
                            </div>
                        )}

                        <div className="pt-2">
                            <p className="text-xs text-gray-400">
                                Application Submitted: {new Date(application.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-200 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReferralDetailsModal;
