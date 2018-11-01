// Copyright (c) 2018 Aidos Developer

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import * as React from 'react';
import { Field, FieldArray,  InjectedFormProps, reduxForm } from 'redux-form';

interface IfieldProps {
	name?: string;
	input?: any;
	label?: string;
	type?: string;
	fields?: any;
	meta?: any;
}

const renderField = ({ name, input, label, type, meta: { touched, error } }: IfieldProps) => (
	<div>
	<input {...input} type={type} className="form-control" name={name} placeholder={label} />
	{touched && error && <span className="text-warning">{error}</span>}
	</div>
);

const renderFieldWithIcon = ({ name, input, label, type ,meta: { touched, error } }: IfieldProps) => (
	<div>
	<input {...input} type={type} className="form-control" name={name} placeholder={label} />
	{touched && error && <span className="text-warning">{error}</span>}
	</div>
);

const renderMembers = ({ fields, meta: { error, submitFailed } }: IfieldProps) => (
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
							/>
						</a>
					</div>
					<div className="form-inline">
						<Field
							name={`${member}.amount`}
							type="text"
							component={renderField}
							label="Amount To Send"
						/>
						<span className="radio-label">ADK</span>
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

interface ICustomProps {
	loading: boolean;
}

interface IState {
	feeField: boolean;
}


class SimpleForm extends React.Component<ICustomProps & InjectedFormProps<{}, ICustomProps>, IState> {
	constructor(props: ICustomProps & InjectedFormProps<{}, ICustomProps>) {
		super(props);
		this.state = {
			feeField: false,
		}
	}

	public render() {
		const { handleSubmit, pristine, reset, submitting } = this.props
		return (
			<form className="send-adk-form" >
				<div className="form-group">
					<Field
						name="comment"
						type="text"
						component={renderField}
						label="Comment"
						id="comment"
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
								value="0"
								onClick={this.radioClick('doPow')}
							/>{' '}
							<span />
							Do PoW
						</label>
						<label className="mt-radio">
							<Field
								name="powType"
								component="input"
								type="radio"
								value="1"
								onClick={this.radioClick('useTicket')}
							/>{' '}
							<span />
							Use Ticket
						</label>
						<label className="mt-radio">
							<Field
								name="powType"
								component="input"
								type="radio"
								value="2"
								onClick={this.radioClick('payFee')}
							/>{' '}
							<span />
							Pay Fee
						</label>
					</div>
				</div>
				{
					this.state.feeField ?
						<div className="form-inline">
							<Field
								name="Fee"
								type="text"
								component={renderField}
								label="Fee"
								id="fee"
							/>
							<span className="radio-label">ADK</span>
						</div> : ''
				}

				<div className="form-group">
					<button type="submit" onClick={handleSubmit} disabled={submitting} className="btn btn-send btn-primary">
						{this.props.loading ? 'Cancel' : 'Send'}
						{this.props.loading && <div className="loader"><i className="icofont-spinner" /></div>}
					</button>
				</div>
			</form>
		)
	}
	private radioClick = (value: any) => {
		return () => {
			if (value === 'payFee') {
				this.setState({ feeField: true });
			} else {
				this.setState({ feeField: false });
			}
		}
	}
}

export default reduxForm<{}, ICustomProps>({
	destroyOnUnmount:false,
	form: 'fieldArrays',
	initialValues: {
		members: [{ address: '', amount: '' }],
		powType: "0"
	},
})(SimpleForm);