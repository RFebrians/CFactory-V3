import React from 'react';
import './AppDownload.css';
import { assets } from '../../assets/frontend_assets/assets';

const AppDownload = () => {
  return (
    <div className="app-download" id="app-download">

    

      {/* Testimonial Section */}
      <div className="testimonials mt-16 px-4">
        <h2 className="text-2xl font-bold text-center mb-6">What Our Users Say</h2>
        {/* horizontal line */}
        <hr className="mb-6 mt-6" />
        <div className="testimonial-cards-container">
          {/* Testimonial Card 1 */}
          <div className="testimonial-card p-6">
            <p className="text-gray-700 mb-4">
              "Tomato App is a game-changer. It's so easy to use and the interface is super smooth!"
            </p>
            <div className="user-info">
              <img
                src="https://img.freepik.com/free-photo/waist-up-portrait-handsome-serious-unshaven-male-keeps-hands-together-dressed-dark-blue-shirt-has-talk-with-interlocutor-stands-against-white-wall-self-confident-man-freelancer_273609-16320.jpg"
                alt="User 1"
                className="w-20 h-20 rounded-md mr-4"
              />
              <div>
                <p className="font-semibold">John Doe</p>
                <p className="text-sm text-gray-500">App User</p>
              </div>
            </div>
          </div>

          {/* Testimonial Card 2 */}
          <div className="testimonial-card p-6">
            <p className="text-gray-700 mb-4">
              "I love the new features in the Tomato App. It makes managing my tasks so much easier!"
            </p>
            <div className="user-info">
              <img
                src="https://img.freepik.com/free-photo/lifestyle-people-emotions-casual-concept-confident-nice-smiling-asian-woman-cross-arms-chest-confident-ready-help-listening-coworkers-taking-part-conversation_1258-59335.jpg"
                alt="User 2"
                className="w-20 h-20 rounded-md mr-4"
              />
              <div>
                <p className="font-semibold">Jane Smith</p>
                <p className="text-sm text-gray-500">App User</p>
              </div>
            </div>
          </div>

          {/* Testimonial Card 3 */}
          <div className="testimonial-card p-6">
            <p className="text-gray-700 mb-4">
              "The Tomato App has made my daily routines much more organized and efficient. Highly recommend!"
            </p>
            <div className="user-info">
              <img
                src="https://img.freepik.com/free-vector/ai-technology-robot-cyborg-illustrations_24640-134419.jpg"
                alt="User 3"
                className="w-20 h-20 rounded-md mr-4"
              />
              <div>
                <p className="font-semibold">Sam Wilson</p>
                <p className="text-sm text-gray-500">App User</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppDownload;
