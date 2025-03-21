/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: ['./index.html', './src/**/*.{ts,js,vue}'],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
			iptGreen: "#7AC142"
		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}