module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'background-primary': '#e7e7e7',  
        'background-secondary': '#fff',
        'text-primary': '#000',
        'text-secondary': '#3C0753',
        'text-third': '#b3a3ba',
        'text-alert': '#ff0000',
        'highlight': '#910A67',
      },
    },
  },
  plugins: [],
}