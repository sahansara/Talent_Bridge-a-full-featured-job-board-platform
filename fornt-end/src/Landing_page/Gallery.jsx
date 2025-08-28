import CM1 from '../assets/community/CM1.jpeg';
import CM2 from '../assets/community/CM2.jpeg';
import CM3 from '../assets/community/CM3.jpeg';
import CM4 from '../assets/community/CM4.jpeg';
export const Gallery = ({ theme }) => {
  const images = [
    CM1,
    CM2,
    CM3,
    CM4,
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Our Community</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {images.map((src, index) => (
            <div key={index} className="relative group overflow-hidden rounded-3xl">
              <img src={src} alt={`Community ${index + 1}`} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Gallery;