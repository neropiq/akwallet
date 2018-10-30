import React = require("react");

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

export const INCREMENT_ENTHUSIASM = 'INCREMENT_ENTHUSIASM';
export type INCREMENT_ENTHUSIASM = typeof INCREMENT_ENTHUSIASM;


export const DECREMENT_ENTHUSIASM = 'DECREMENT_ENTHUSIASM';
export type DECREMENT_ENTHUSIASM = typeof DECREMENT_ENTHUSIASM;

function TermText() {
    return (
        <p>
            PLEASE READ THESE TERMS & AGREEMENTS CAREFULLY. BY USING THIS SOFTWARE, YOU AGREE TOBE BOUND BY THESE TERMS OF SERVICE AND ALL TERMS INCORPORATED BY REFERENCE.
            IF YOU DO NOT AGREE TO THESE TERMS DO NOT ACCESS OR USE THIS SOFTWARE.
<br /><br />
            Aidos Kuneen is open-souce software that is licensed under the MIT License. See License.
            By the use of this Wallet you agree that the Aidos Foundation & Developers are under no circumstances liable for any loss or injury
            suffered by any kind of errors including keyboard input errors by the user.
<br /><br />
            AIDOS FOUNDATION & DEVELOPERS SHALL HAVE NO LIABILITY FOR ANY DAMAGES OF ANY KIND
            (INCLUDING WITHOUT LIMITATION INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, OR TORT DAMAGES, OR LOST COINS) IN CONNECTION WITH YOUR USE OF THE SOFTWARE.
</p>
    )
}
export default TermText;