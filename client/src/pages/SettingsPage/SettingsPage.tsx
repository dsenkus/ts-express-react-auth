import React, { FunctionComponent } from 'react';
import PageTitle from '../../components/PageTitle/PageTitle';
import UpdateProfileForm from '../../components/UpdateProfileForm/UpdateProfileForm';
import ChangePasswordForm from '../../components/ChangePasswordForm/ChangePasswordForm';
import DeleteAccountDialog from '../../components/DeleteAccountDialog/DeleteAccountDialog';


const SettingsPage: FunctionComponent = () => {
  return (
    <div className="SettingsPage">
      <PageTitle title="Settings"/>
      <div className="row fg1">
        <div className="col-xs-12 col-sm-6 flex">
          <div className="item-box pa3 mb3 fg1">
            <h2 className="mt0 mb2">Change your personal data</h2>
            <UpdateProfileForm />
          </div>
        </div>

        <div className="col-xs-12 col-sm-6">
          <div className="item-box pa3 mb3">
            <h2 className="mt0 mb2">Change password</h2>
            <ChangePasswordForm/>
          </div>
        </div>
      </div>

      <div className="item-box pa3 mb3">
        <h2 className="mt0 mb2">Delete account</h2>
        <p>Once you delete your account, there is no going back. Please be certain.</p>
        <DeleteAccountDialog/>
      </div>
    </div>
  )
};

export default SettingsPage;
