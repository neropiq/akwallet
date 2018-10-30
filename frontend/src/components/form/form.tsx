import * as React from 'react';
import { Field, FieldArray, FormProps, reduxForm, InjectedFormProps } from 'redux-form';
// import { any } from 'prop-types';
// import { Props } from '../sendAdk/sendAdk';

interface fieldProps {
    name?: string;
    input?: any;
    label?: string;
    type?: string;
    fields?: any;
    meta?: any;
}

const renderField = ({ name, input, label, type }: fieldProps) => (
		<input {...input} type={type} className="form-control" name={name} placeholder={label} />
);

const renderFieldWithIcon = ({ name, input, label, type }: fieldProps) => (
		<input {...input} type={type} className="form-control" name={name} placeholder={label} />
);

const renderMembers = ({ fields, meta: { error, submitFailed } }: fieldProps) => (
	<div>
		{
			fields.map((member: any, index: number) => (
			<div key={index}>
				<div className="form-group position-relative">
					<Field
						name={`${member}.address`}
						type="text"
						component={renderFieldWithIcon}
						label="Address To Send"
					/>
					<a href="#" className="position-icon">
						<i 
							className={((fields.length - 1) === index) ? "icofont-plus-circle icon-green-light" : "icofont-minus-circle icon-grey"} 
							onClick={((fields.length - 1) === index) ? () => fields.push() : () => fields.remove(index)}
						>
						</i>
					</a>
				</div>
				<div className="form-group">
					<Field
						name={`${member}.amount`}
						type="text"
						component={renderField}
						label="Amount To Send"
					/>
				</div>
			</div>
		))}
	</div>
)

// interface InitialValuesProps {
// 	members: any,
// 	powType: any
// }

// interface Props extends FormProps<InitialValuesProps, {}, {}> {
// 	loading: any,
// 	handleSubmit: any,
// 	pristine: any,
// 	reset: any,
// 	submitting: any,
// 	initialValues: any,
// 	members: any,
// 	powType: any
//   }

interface CustomProps {
	loading: boolean;
	
  }
// interface IState {
// 	feeField:boolean;
// }
class SimpleForm extends React.Component< CustomProps & InjectedFormProps<{}, CustomProps> > {
	readonly state = {feeField:false};
	radioClick(value:any){		
		if(value === 'payFee'){
			this.setState({feeField:true});
		}else{
			this.setState({feeField:false});
		}		
	}
	render() {
		const { handleSubmit, pristine, reset, submitting  } = this.props
		return (
			<form className="send-adk-form" onSubmit={handleSubmit}>
				<div className="form-group">
					<Field
						name="comment"
						type="text"
						component={renderField}
						label="Comment"
					/>
				</div>
				<FieldArray name="members" component={renderMembers} />
				<div className="form-group">
					<label className="radio-label">
						PoW Type
					</label>
					<div className="radio-inline">
						<label className="mt-radio">
							<Field
								name="powType"
								component="input"
								type="radio"
								value="doPow"
								onClick={() => {this.radioClick('doPow')}}
							/>{' '}
							<span></span>
							Do PoW
						</label>
						<label className="mt-radio">
							<Field
								name="powType"
								component="input"
								type="radio"
								value="useTicket"
								onClick={() => {this.radioClick('useTicket')}}
							/>{' '}
							<span></span>
							Use Ticket
						</label>
						<label className="mt-radio">
							<Field
								name="powType"
								component="input"
								type="radio"
								value="payFee"
								onClick={() => {this.radioClick('payFee')}}
							/>{''}
							<span></span>
							Pay Fee
						</label>
					</div>
				</div>
				{
					this.state.feeField ? 
					<div className="form-group">
						<Field
							name="Fee"
							type="text"
							component={renderField}
							label="Fee"
						/>
					</div> : ''
				}
				
				<div className="form-group">
					<button type="submit" disabled={submitting} className="btn btn-send btn-primary">
					    { this.props.loading ? 'Cancel' : 'Send'}
						{this.props.loading && <div className="loader"><i className="icofont-spinner"></i></div>}
					</button>
				</div>
			</form>
		)
	}
}

export default reduxForm<{}, CustomProps>({
	form: 'fieldArrays',
	initialValues: {
		members: [{address: '', amount: ''}],
		powType: "doPow"
	}
})(SimpleForm);