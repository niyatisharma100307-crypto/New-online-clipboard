import { Zap, Shield, Globe, Lock, Info } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <Zap className="w-5 h-5 text-white" />,
      title: "Instant Sync",
      desc: "Your text moves between devices immediately. No waiting.",
      gradient: "from-blue-600 to-cyan-400",
      tag: "Fast"
    },
    {
      icon: <Shield className="w-5 h-5 text-white" />,
      title: "Auto-Delete",
      desc: "Clips disappear automatically after 24 hours to keep things clean.",
      gradient: "from-purple-600 to-indigo-500",
      tag: "Secure"
    },
    {
      icon: <Globe className="w-5 h-5 text-white" />,
      title: "Any Device",
      desc: "Works on your phone, tablet, or laptop browser. No app needed.",
      gradient: "from-emerald-500 to-green-400",
      tag: "Web"
    },
    {
      icon: <Lock className="w-5 h-5 text-white" />,
      title: "Private",
      desc: "We don't track you or read your clips. Simple and anonymous.",
      gradient: "from-orange-500 to-yellow-400",
      tag: "Safe"
    }
  ];

  return (
    <div className="mt-24 border-t border-[#141416] pt-12 font-sans">
      <div className="flex items-center gap-2 mb-8 opacity-60">
        <Info className="w-4 h-4 text-blue-500" />
        <span className="text-xs font-bold text-blue-500 tracking-widest uppercase">
          Why use this?
        </span>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, idx) => (
          <div 
            key={idx} 
            className="group bg-[#0A0A0A] border border-[#141416] p-6 rounded-lg hover:border-gray-600 transition-all duration-300 relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${feature.gradient} opacity-5 group-hover:opacity-10 rounded-bl-full transition-opacity`} />
            
            <div className={`w-10 h-10 mb-4 rounded flex items-center justify-center bg-gradient-to-br ${feature.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              {feature.icon}
            </div>
            
            <div className="mb-2 flex justify-between items-center">
              <h3 className="text-gray-200 font-bold text-sm">
                {feature.title}
              </h3>
              <span className="text-[10px] bg-[#111] text-gray-500 px-2 py-0.5 rounded border border-[#222]">
                {feature.tag}
              </span>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}