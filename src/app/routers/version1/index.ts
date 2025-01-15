import express from 'express';
import userRouter from '../../modules/userModule/user.routes';
import adminRouter from '../../modules/adminModule/admin.routes';
import userAuthRouter from '../../modules/authModule/userAuthModule/auth.routes';
import outletRouter from '../../modules/outletModule/outlet.routes';
import adminAuthRouter from '../../modules/authModule/adminAuthModule/auth.routes';
import serviceCategoryRouter from '../../modules/serviceCategoryModule/serviceCategory.routes';
import serviceRouter from '../../modules/serviceModule/service.routes';
import sliderRouter from '../../modules/sliderModule/slider.routes';
import aboutUsRouter from '../../modules/aboutUsModule/abountUs.routes';
import privacyPolicyRouter from '../../modules/privacyPolicyModule/privacyPolicy.routes';
import termsConditionRouter from '../../modules/termsConditionModule/termsCondition.routes';
import scheduleRouter from '../../modules/scheduleModule/schedule.routes';
import bookingRouter from '../../modules/bookingModule/booking.routes';
import feedbackRouter from '../../modules/feedbackModule/feedback.routes';
import wishlistRouter from '../../modules/wishlistModule/wishlist.routes';
import earningRouter from '../../modules/earningModule/earning.routes';
import conversationRouter from '../../modules/conversationModule/conversations.routes';
import messageRouter from '../../modules/messageModule/message.routes';
import attachmentRouter from '../../modules/attachmentModule/attachment.routes';
import notificationRouter from '../../modules/notificationModule/notification.routes';
import dashboardRouter from '../../modules/dashboardMatrix/dashboardMatrix.routes';

const routers = express.Router();

routers.use('/user', userRouter)
routers.use('/admin', adminRouter)
routers.use('/auth', userAuthRouter)
routers.use('/auth/admin', adminAuthRouter)
routers.use('/outlet', outletRouter)
routers.use('/service-category', serviceCategoryRouter)
routers.use('/service', serviceRouter)
routers.use('/slider', sliderRouter)
routers.use('/about-us', aboutUsRouter)
routers.use('/privacy-policy', privacyPolicyRouter)
routers.use('/terms-condition', termsConditionRouter)
routers.use('/schedule', scheduleRouter)
routers.use('/booking', bookingRouter)
routers.use('/feedback', feedbackRouter)
routers.use('/wishlist', wishlistRouter)
routers.use('/earning', earningRouter)
routers.use('/conversation', conversationRouter)
routers.use('/message', messageRouter)
routers.use('/attachment', attachmentRouter)
routers.use('/notification', notificationRouter)
routers.use('/dashboard', dashboardRouter)

export default routers;
