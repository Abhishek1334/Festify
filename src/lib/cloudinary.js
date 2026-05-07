const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

export const getCloudinaryUrl = (publicIdOrUrl, transforms = '') => {
	if (!publicIdOrUrl) return '';
	if (publicIdOrUrl.startsWith('http')) return publicIdOrUrl;

	const cleanId = publicIdOrUrl.replace(/^\/+/, '');
	const transformSegment = transforms ? `${transforms}/` : '';
	return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformSegment}${cleanId}`;
};

export const cloudinaryThumb = (publicIdOrUrl, w = 400, h = 300) =>
	getCloudinaryUrl(publicIdOrUrl, `w_${w},h_${h},c_fill,q_auto,f_auto`);
