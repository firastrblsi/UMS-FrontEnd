import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/core/hooks/useAppSelector";
import { selectUser } from "@/modules/auth/redux/authSelectors";
import { studentApi } from "@/modules/students/api/studentApi";
import { teacherApi } from "@/modules/teachers/api/teacherApi";
import type { Student } from "@/modules/students/types/student.types";
import type { Teacher } from "@/modules/teachers/types/teacher.types";
import type { User } from "@/modules/auth/types/auth";
import Loader from "@/shared/ui/Loader";
import { Button } from "@/shared/ui/Button";
import EditMyProfileForm from "@/modules/profile/components/EditMyProfileForm";

import { Building2, Mail, Phone, Calendar, BadgeCheck, GraduationCap, MapPin, Briefcase, Pencil } from "lucide-react";


export default function MyProfile() {
  const { t } = useTranslation();
  const user = useAppSelector(selectUser);
  const [profile, setProfile] = useState<Student | Teacher | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        if (user.role === "STUDENT") {
          const data = await studentApi.getProfileByUserId(user.id);
          setProfile(data);
        } else if (user.role === "TEACHER") {
          const data = await teacherApi.getProfileByUserId(user.id);
          setProfile(data);
        } else {
          // ADMIN
          setProfile(null);
        }
      } catch (err: any) {
        console.error("Failed to fetch profile", err);
        setError("Could not load profile.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleEditSuccess = (_updatedUser: User) => {
    setIsEditing(false);
    // Re-fetch profile to reflect any changes
    if (user?.role === "STUDENT") {
      studentApi.getProfileByUserId(user.id).then(setProfile).catch(console.error);
    } else if (user?.role === "TEACHER") {
      teacherApi.getProfileByUserId(user.id).then(setProfile).catch(console.error);
    }
  };

  if (isLoading) return <Loader />;

  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  if (!profile && user?.role === "ADMIN") {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <h1 className="text-2xl mb-4 shrink-0">{t("routes.my_profile", "My Profile")}</h1>
        {isEditing ? (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex-1 overflow-y-auto min-h-0">
            <EditMyProfileForm
              user={user}
              profile={null}
              onSuccess={handleEditSuccess}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        ) : (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold">
                  {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{user.firstName} {user.lastName}</h2>
                  <p className="text-slate-500">{user.email}</p>
                  <div className="mt-2 inline-block px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full">
                    {t("labels.administrator", "ADMINISTRATOR")}
                  </div>
                </div>
              </div>
              <Button buttonType="secondary" onClick={() => setIsEditing(true)}>
                <Pencil className="w-4 h-4 mr-1" />
                {t("profile.edit_profile", "Edit Profile")}
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (!profile) return null;

  // Type guards
  const isStudent = (_p: any): _p is Student => user?.role === "STUDENT";
  const isTeacher = (_p: any): _p is Teacher => user?.role === "TEACHER";

  const getAvatarUrl = () => {
    if (!user?.profilePicture?.url) return undefined;
    if (user.profilePicture.url.startsWith("http")) return user.profilePicture.url;
    return `${import.meta.env.VITE_API_URL || "http://localhost:3000"}${user.profilePicture.url}`;
  };

  if (isEditing && user) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <h1 className="text-2xl ">{t("profile.edit_profile", "Edit Profile")}</h1>
        </div>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex-1 overflow-y-auto min-h-0">
          <EditMyProfileForm
            user={user}
            profile={profile}
            onSuccess={handleEditSuccess}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 h-full pb-10">
      {/* Header / Banner Section */}
      <div className="relative rounded-3xl bg-white shadow-sm border border-slate-100 flex flex-col group overflow-visible transition-all duration-500 hover:shadow-md">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-blue-50/30 rounded-3xl pointer-events-none"></div>
        
        {/* Banner Graphic */}
        <div className="h-44 rounded-t-3xl bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-300 via-indigo-500 to-purple-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>
          {/* Decorative shapes */}
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute top-8 left-1/4 w-32 h-32 bg-blue-300/30 rounded-full blur-2xl"></div>
        </div>

        <div className="px-10 pb-10 relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-end -mt-16">
          {/* Avatar with Glow */}
          <div className="relative group-hover:scale-105 transition-transform duration-500 ease-out">
            <div className="absolute inset-0 bg-blue-500 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
            <div className="w-36 h-36 rounded-full bg-white p-1.5 shadow-xl relative z-10">
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-blue-50 to-indigo-100 flex items-center justify-center text-4xl font-bold text-indigo-600 overflow-hidden border border-slate-100">
                {getAvatarUrl() && !imageError ? (
                  <img 
                    src={getAvatarUrl()} 
                    alt="Avatar" 
                    className="w-full h-full object-cover" 
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <>{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</>
                )}
              </div>
            </div>
            
            {/* Status Badge Overlap */}
            <div className={`absolute bottom-2 right-2 w-5 h-5 rounded-full border-4 border-white ${user?.isActive ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-rose-500'} z-20`}></div>
          </div>

          <div className="flex-1 flex flex-col gap-2 mb-2">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              {user?.firstName} {user?.lastName}
              {user?.role === "ADMIN" && (
                <BadgeCheck className="w-6 h-6 text-indigo-500" />
              )}
            </h2>
            <p className="text-slate-500 font-medium text-lg flex items-center gap-2">
              {isTeacher(profile) && profile.title ? <span className="text-indigo-600 font-semibold">{profile.title}</span> : ""}
              {isTeacher(profile) ? profile.department?.name : ""}
              {isStudent(profile) ? profile.program?.name : ""}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 mb-2">
            {isStudent(profile) && (
              <div className="px-4 py-2 bg-white/80 backdrop-blur shadow-sm text-slate-700 text-sm font-semibold rounded-2xl border border-slate-200/60 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-500" />
                {profile.studentNumber}
              </div>
            )}
            {isTeacher(profile) && profile.employeeId && (
              <div className="px-4 py-2 bg-white/80 backdrop-blur shadow-sm text-slate-700 text-sm font-semibold rounded-2xl border border-slate-200/60 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-500" />
                {profile.employeeId}
              </div>
            )}
            <Button buttonType="secondary" onClick={() => setIsEditing(true)} className="flex items-center gap-1">
              <Pencil className="w-4 h-4" />
              {t("profile.edit_profile", "Edit Profile")}
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats / Highlights Row */}
      {profile && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">{isStudent(profile) ? "Enrolled" : "Hired"}</p>
            <p className="text-lg font-bold text-slate-800">
              {(isStudent(profile) ? profile.enrollmentDate : profile.hireDate) 
                ? new Date((isStudent(profile) ? profile.enrollmentDate : profile.hireDate)!).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) 
                : "—"}
            </p>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
              <BadgeCheck className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Status</p>
            <p className="text-lg font-bold text-slate-800">
              {isStudent(profile) ? t(`student.status.${profile.status}`, profile.status) : (profile.contractType || "—")}
            </p>
          </div>
          {isTeacher(profile) && (
            <>
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center mb-4">
                  <GraduationCap className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Degree</p>
                <p className="text-lg font-bold text-slate-800">{profile.highestDegree || "—"}</p>
              </div>
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
                  <Building2 className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Office</p>
                <p className="text-lg font-bold text-slate-800">{profile.officeRoom || "—"}</p>
              </div>
            </>
          )}
          {isStudent(profile) && (
            <>
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center mb-4">
                  <GraduationCap className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Scholarship</p>
                <p className="text-lg font-bold text-slate-800">{profile.scholarshipType || "NONE"}</p>
              </div>
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
                  <Building2 className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Year</p>
                <p className="text-lg font-bold text-slate-800">Year {profile.currentYearNumber || "—"}</p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex-1">
        
        {/* Custom Pill Tabs */}
        <div className="flex gap-2 p-4 border-b border-slate-100 bg-slate-50/50">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-300 ${
              activeTab === 'overview' 
                ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' 
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
            }`}
          >
            {t("labels.overview", "Overview")}
          </button>
          <button 
            onClick={() => setActiveTab('academic')}
            className={`px-6 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-300 ${
              activeTab === 'academic' 
                ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' 
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
            }`}
          >
            {isTeacher(profile) ? t("labels.professional_details", "Professional Details") : t("labels.academic_details", "Academic Details")}
          </button>
          {isTeacher(profile) && profile.bio && (
            <button 
              onClick={() => setActiveTab('bio')}
              className={`px-6 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                activeTab === 'bio' 
                  ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' 
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
              }`}
            >
              {t("labels.biography", "Biography")}
            </button>
          )}
        </div>

        <div className="p-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="flex flex-col gap-6">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                  <span className="w-8 h-1 bg-indigo-500 rounded-full"></span>
                  {t("labels.contact_info", "Contact Information")}
                </h3>
                <div className="space-y-4">
                  <div className="group flex items-center gap-5 p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-white group-hover:shadow-sm flex items-center justify-center transition-all duration-300">
                      <Mail className="w-5 h-5 text-slate-500 group-hover:text-indigo-500 transition-colors" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-0.5">{t("labels.personal_email", "Personal Email")}</p>
                      <p className="text-base font-semibold text-slate-800">{user?.email}</p>
                    </div>
                  </div>
                  {isTeacher(profile) && profile.professionalEmail && (
                    <div className="group flex items-center gap-5 p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all duration-300">
                      <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-white group-hover:shadow-sm flex items-center justify-center transition-all duration-300">
                        <Briefcase className="w-5 h-5 text-slate-500 group-hover:text-indigo-500 transition-colors" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-0.5">{t("labels.professional_email", "Professional Email")}</p>
                        <p className="text-base font-semibold text-slate-800">{profile.professionalEmail}</p>
                      </div>
                    </div>
                  )}
                  <div className="group flex items-center gap-5 p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-white group-hover:shadow-sm flex items-center justify-center transition-all duration-300">
                      <Phone className="w-5 h-5 text-slate-500 group-hover:text-indigo-500 transition-colors" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-0.5">{t("labels.phone_number", "Phone Number")}</p>
                      <p className="text-base font-semibold text-slate-800">{user?.phone || "—"}</p>
                    </div>
                  </div>
                  <div className="group flex items-center gap-5 p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-white group-hover:shadow-sm flex items-center justify-center transition-all duration-300">
                      <MapPin className="w-5 h-5 text-slate-500 group-hover:text-indigo-500 transition-colors" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-0.5">{t("labels.nationality", "Nationality")}</p>
                      <p className="text-base font-semibold text-slate-800">{user?.nationality || "—"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {isStudent(profile) && (
                <div className="flex flex-col gap-6">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                    <span className="w-8 h-1 bg-indigo-500 rounded-full"></span>
                    {t("labels.guardian_info", "Guardian Information")}
                  </h3>
                  <div className="space-y-4">
                    <div className="group flex items-center gap-5 p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all duration-300">
                      <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-white group-hover:shadow-sm flex items-center justify-center transition-all duration-300">
                        <BadgeCheck className="w-5 h-5 text-slate-500 group-hover:text-indigo-500 transition-colors" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-0.5">{t("student.guardian_name", "Guardian Name")}</p>
                        <p className="text-base font-semibold text-slate-800">{profile.guardianName || "—"}</p>
                      </div>
                    </div>
                    <div className="group flex items-center gap-5 p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all duration-300">
                      <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-white group-hover:shadow-sm flex items-center justify-center transition-all duration-300">
                        <Phone className="w-5 h-5 text-slate-500 group-hover:text-indigo-500 transition-colors" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-0.5">{t("student.guardian_phone", "Guardian Phone")}</p>
                        <p className="text-base font-semibold text-slate-800">{profile.guardianPhone || "—"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'academic' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-8">
              {isStudent(profile) && (
                <>
                  <div className="flex flex-col">
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-1">{t("labels.program", "Program")}</p>
                    <p className="text-lg font-bold text-slate-800">{profile.program?.name || "—"}</p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-1">{t("labels.enrollment_date", "Enrollment Date")}</p>
                    <p className="text-lg font-bold text-slate-800">{profile.enrollmentDate ? new Date(profile.enrollmentDate).toLocaleDateString() : "—"}</p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-1">{t("labels.scholarship_type", "Scholarship Type")}</p>
                    <p className="text-lg font-bold text-slate-800">{profile.scholarshipType ? t(`student.scholarship.${profile.scholarshipType}`, profile.scholarshipType) : "—"}</p>
                  </div>
                </>
              )}

              {isTeacher(profile) && (
                <>
                  <div className="flex flex-col">
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-1">{t("labels.department", "Department")}</p>
                    <p className="text-lg font-bold text-slate-800">{profile.department?.name || "—"}</p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-1">{t("labels.specialization", "Specialization")}</p>
                    <p className="text-lg font-bold text-slate-800">{profile.specialization || "—"}</p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-1">{t("labels.highest_degree", "Highest Degree")}</p>
                    <p className="text-lg font-bold text-slate-800">{profile.highestDegree ? t(`teacher.degree.${profile.highestDegree}`, profile.highestDegree) : "—"}</p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-1">Degree Field</p>
                    <p className="text-lg font-bold text-slate-800">{profile.degreeField || "—"}</p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-1">Institution</p>
                    <p className="text-lg font-bold text-slate-800">{profile.degreeInstitution || "—"}</p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-1">{t("labels.office_hours", "Office / Hours")}</p>
                    <p className="text-lg font-bold text-slate-800">{profile.officeRoom || "—"} / {profile.officeHours || "—"}</p>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'bio' && isTeacher(profile) && profile.bio && (
            <div className="max-w-4xl">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3 mb-6">
                <span className="w-8 h-1 bg-indigo-500 rounded-full"></span>
                About
              </h3>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <p className="text-slate-700 text-lg whitespace-pre-wrap leading-relaxed">{profile.bio}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
