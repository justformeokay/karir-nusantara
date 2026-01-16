# Color Implementation Examples - Karir Nusantara

This guide shows practical examples of how to implement the flat design color system across different pages and components.

---

## 🏠 Navigation Bar Example

```tsx
export function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-card">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold text-blue-600">Karir Nusantara</div>
        
        {/* Links */}
        <div className="flex gap-6">
          <a href="/" className="text-gray-900 hover:text-blue-600 transition-colors font-medium">
            Jobs
          </a>
          <a href="/articles" className="text-gray-900 hover:text-blue-600 transition-colors font-medium">
            Articles
          </a>
          <a href="/cv-builder" className="text-gray-900 hover:text-blue-600 transition-colors font-medium">
            CV Builder
          </a>
        </div>
        
        {/* CTA Button */}
        <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-6 rounded transition-colors">
          Login
        </button>
      </div>
    </nav>
  );
}
```

---

## 💼 Job Card Component

```tsx
export function JobCard({ job }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-card hover:shadow-card-hover transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-gray-900 text-lg font-bold hover:text-blue-600 transition-colors cursor-pointer">
            {job.title}
          </h3>
          <p className="text-gray-600 text-sm">{job.company}</p>
        </div>
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm font-medium">
          {job.type}
        </span>
      </div>
      
      {/* Description */}
      <p className="text-gray-700 text-sm mb-4">
        {job.description}
      </p>
      
      {/* Tags */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {job.skills.map(skill => (
          <span key={skill} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
            {skill}
          </span>
        ))}
      </div>
      
      {/* Salary and Button */}
      <div className="flex justify-between items-center">
        <p className="text-gray-900 font-semibold">
          {job.salary}
        </p>
        <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-6 rounded transition-colors">
          Lamar Pekerjaan
        </button>
      </div>
    </div>
  );
}
```

---

## 📄 Job Detail Page

```tsx
export function JobDetailPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header with CTA */}
      <div className="bg-white border-b border-gray-200 shadow-card">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-gray-900 text-3xl font-bold mb-2">Senior Developer</h1>
              <p className="text-gray-600 text-lg">Tech Company Inc.</p>
              <p className="text-gray-500 text-sm mt-2">Jakarta, Indonesia • Full Time</p>
            </div>
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-lg transition-colors">
              Lamar Pekerjaan
            </button>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Job Description Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-6 shadow-card">
          <h2 className="text-gray-900 text-2xl font-bold mb-4 pb-4 border-b border-gray-200">
            Job Description
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We are looking for a talented developer to join our growing team...
          </p>
        </div>
        
        {/* Requirements Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-6 shadow-card">
          <h2 className="text-gray-900 text-2xl font-bold mb-4 pb-4 border-b border-gray-200">
            Requirements
          </h2>
          <ul className="space-y-3">
            <li className="text-gray-700 flex items-center">
              <span className="text-emerald-500 font-bold mr-3">✓</span>
              5+ years experience
            </li>
            <li className="text-gray-700 flex items-center">
              <span className="text-emerald-500 font-bold mr-3">✓</span>
              Expert in React & TypeScript
            </li>
          </ul>
        </div>
        
        {/* Benefits Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 shadow-card">
          <h2 className="text-gray-900 text-2xl font-bold mb-4">What We Offer</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-gray-700">• Competitive Salary</div>
            <div className="text-gray-700">• Health Insurance</div>
            <div className="text-gray-700">• Remote Work</div>
            <div className="text-gray-700">• Professional Development</div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 🎓 Form Components

### Login Form
```tsx
export function LoginForm() {
  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-card">
        <h2 className="text-gray-900 text-2xl font-bold mb-6 text-center">Login</h2>
        
        {/* Email Input */}
        <div className="mb-6">
          <label className="block text-gray-900 font-medium mb-2">Email</label>
          <input
            type="email"
            className="w-full border border-gray-200 bg-white rounded px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-colors"
            placeholder="you@example.com"
          />
        </div>
        
        {/* Password Input */}
        <div className="mb-6">
          <label className="block text-gray-900 font-medium mb-2">Password</label>
          <input
            type="password"
            className="w-full border border-gray-200 bg-white rounded px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-colors"
            placeholder="••••••••"
          />
        </div>
        
        {/* Submit Button */}
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition-colors mb-4">
          Login
        </button>
        
        {/* Secondary Link */}
        <p className="text-center">
          <a href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
            Don't have an account? Register
          </a>
        </p>
      </div>
    </div>
  );
}
```

---

## 📋 Search & Filter Section

```tsx
export function JobFiltersSection() {
  return (
    <div className="bg-white border-b border-gray-200 shadow-card p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-gray-900 font-bold text-lg mb-6">Find Your Next Job</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Job title or keyword..."
            className="border border-gray-200 bg-white rounded px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-colors"
          />
          
          {/* Location */}
          <select className="border border-gray-200 bg-white rounded px-4 py-3 text-gray-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-colors">
            <option>All Locations</option>
            <option>Jakarta</option>
            <option>Surabaya</option>
          </select>
          
          {/* Job Type */}
          <select className="border border-gray-200 bg-white rounded px-4 py-3 text-gray-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-colors">
            <option>All Types</option>
            <option>Full Time</option>
            <option>Part Time</option>
          </select>
          
          {/* Search Button */}
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition-colors">
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## 📊 CV Builder Preview

```tsx
export function CVBuilderPreview() {
  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Editor */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-card">
        <h2 className="text-gray-900 font-bold mb-4">Edit Your CV</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-gray-900 font-medium mb-2">Full Name</label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded px-4 py-2 text-gray-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-colors"
              placeholder="John Doe"
            />
          </div>
          <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded transition-colors">
            Save Changes
          </button>
        </form>
      </div>
      
      {/* Preview */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-card">
        <h2 className="text-blue-600 text-2xl font-bold mb-2">John Doe</h2>
        <p className="text-gray-600 text-sm mb-4">john@example.com | +62 812 3456 7890</p>
        
        <h3 className="text-blue-600 font-bold mt-6 mb-2 pb-2 border-b border-emerald-500">Experience</h3>
        <p className="text-gray-900 font-semibold">Senior Developer</p>
        <p className="text-gray-600 text-sm">Tech Company • 2020 - Present</p>
        
        <div className="mt-6 flex gap-2">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs">React</span>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs">TypeScript</span>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs">Node.js</span>
        </div>
      </div>
    </div>
  );
}
```

---

## 👣 Footer Component

```tsx
export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-gray-900 font-bold mb-4">About</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Careers</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-gray-900 font-bold mb-4">Jobs</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Browse Jobs</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">New Jobs</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-gray-900 font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">For Companies</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Post a Job</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-gray-900 font-bold mb-4">Follow Us</h3>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">f</a>
              <a href="#" className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">𝕏</a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-6 text-center text-gray-500">
          <p>&copy; 2026 Karir Nusantara. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
```

---

## 🎯 Alert & Status Messages

```tsx
// Success Message
<div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded">
  ✓ Application submitted successfully!
</div>

// Error Message
<div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
  ✗ Please fill in all required fields
</div>

// Info Message
<div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded">
  ℹ You have 3 new job recommendations
</div>

// Warning Message
<div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
  ⚠ Your CV hasn't been updated in 3 months
</div>
```

---

## 📝 Notes

- Always use `transition-colors` for hover effects
- Use `shadow-card` for consistent card styling
- Maintain spacing with Tailwind gap/spacing classes
- Keep focus states visible with `focus:ring` and `focus:border`
- Test all states: default, hover, focus, active, disabled
- Ensure sufficient contrast for accessibility

For more details, see [COLOR_SYSTEM.md](./COLOR_SYSTEM.md) and [COLORS.md](./COLORS.md)
