import { Clock, Layout, Mail, ShieldCheck, Zap } from "lucide-react";
const features = [
  {
    title: "Omnichannel Auth",
    desc: "Seamless Google, GitHub, and Custom Credentials login using NextAuth.js.",
    icon: <ShieldCheck className="w-6 h-6 text-teal-500" />,
  },
  {
    title: "Advanced Password Recovery",
    desc: "Secure Forget & Reset flow implemented with Nodemailer for email delivery.",
    icon: <Mail className="w-6 h-6 text-blue-500" />,
  },
  {
    title: "Time-Sensitive Security",
    desc: "Custom 10-minute countdown clock for password resets to enhance security.",
    icon: <Clock className="w-6 h-6 text-red-500" />,
  },
  {
    title: "Modern UI/UX",
    desc: "Built with Tailwind CSS, React Hook Form, and SweetAlert2 for fluid experience.",
    icon: <Layout className="w-6 h-6 text-purple-500" />,
  },
];

const HomePage = () => {
  return (
    <div>
      <h1 className="text-3xl text-center mt-10">Welcome To Home Page</h1>

      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              User Management & Authentication System
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A robust full-stack solution ensuring seamless onboarding and
              high-level data security.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="mb-4">{f.icon}</div>
                <h3 className="font-bold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Tech Stack Table */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-center mb-8 flex items-center justify-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" /> Powered By Modern Tech
              Stack
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="py-4 px-4 text-gray-400 font-medium italic">
                      Layer
                    </th>
                    <th className="py-4 px-4 text-gray-400 font-medium italic">
                      Technology
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="py-4 px-4 font-semibold text-gray-700">
                      Frontend
                    </td>
                    <td className="py-4 px-4 flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                        Next.js (App Router)
                      </span>
                      <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-xs font-bold">
                        React Hook Form
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="py-4 px-4 font-semibold text-gray-700">
                      Backend
                    </td>
                    <td className="py-4 px-4 flex items-center gap-2">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold font-mono italic">
                        Express.js
                      </span>
                      <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
                        Node.js
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition">
                    <td className="py-4 px-4 font-semibold text-gray-700">
                      Database
                    </td>
                    <td className="py-4 px-4">
                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
                        MongoDB
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
