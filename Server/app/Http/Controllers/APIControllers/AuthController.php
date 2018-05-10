<?php

namespace App\Http\Controllers\APIControllers;

use App\User;
use App\PasswordResets;
use App\SendMailable;
use Mail;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Foundation\Auth\RegistersUsers;

class AuthController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
     
     use RegistersUsers;
        
    public function register(Guard $auth, Request $request) {
        
        $fields = ['email', 'password', 'name'];
        // grab credentials from the request
        $credentials = $request->only($fields);
        
        $validator = Validator::make(
            $credentials,
            [
                'name' => 'required|max:255',
                'email' => 'required|email|max:255|unique:users',
                'password' => 'required|min:6',
            ]
            );
        if ($validator->fails())
        {
            return response($validator->messages());
        }
        
        $result = User::create([
            'name' => $credentials['name'],
            'email' => $credentials['email'],
            'password' => bcrypt($credentials['password']),
        ]);
        
        $result['token'] = $this->tokenFromUser($result['id']);        

        return response($result->only(['email', 'token']));
    }
    
    
    protected function login(Request $request) {
        
        auth()->shouldUse('api');
        // grab credentials from the request
        $credentials = $request->only('email', 'password');

        if (auth()->attempt($credentials)) {
            $result['token'] = auth()->issue();
            $result['email'] = $credentials['email'];
           return response($result);
        }
    
        return response(['Invalid Credentials']);
    }
    
    public function tokenFromUser($id)
    {
        // generating a token from a given user.
        $user = User::find($id);
    
        auth()->shouldUse('api');
        // logs in the user
        auth()->login($user);
    
        // get and return a new token
        $token = auth()->issue();
    
        return $token;
    }

    public function passwordResetEmail(Request $request) {
        $fields = ['email', 'url'];
        // grab credentials from the request
        $credentials = $request->only($fields);
        foreach($fields as $field) {
            $credentials[$field] = trim($credentials[$field]);
        }

        $validator = Validator::make(
            $credentials,
            [
                'email' => 'required|email|max:255',
                'url' => 'required'
            ]
            );
        if ($validator->fails())
        {
            return response([
                'success' => false, 
                'message' => $validator->messages(), 
                'status_code' => 400 
            ]);
        }

        $email = $credentials['email'];

        $user = User::where('email', '=' , $email)->first();
        if(!$user) {
            return response([
                'success' => false, 
                'message' => 'We can not find email you provided in our database! You can register a new account with this email.', 
                'status_code' => 404 
            ]);
        }

        // delete existings resets if exists
        PasswordResets::where('email', $email)->delete();
        
        $url = $credentials['url'];
        $token = str_random(64);
        $result = PasswordResets::create([
            'email' => $email,
            'token' => $token
        ]);
        
        if($result) {
            Mail::to($email)->queue(new SendMailable($url, $token));
            return response([
                'success' => true, 
                'message' => 'The mail has been sent successfully!', 
                'status_code' => 201
            ]);
        }
        return response([
            'success' => false, 
            'message' => $error, 
            'status_code' => 500 
        ]);
    }

    public function resetPassword(Request $request) { 
        $fields = ['password', 'token'];
        // grab credentials from the request
        $credentials = $request->only($fields);
        foreach($fields as $field) {
            $credentials[$field] = trim($credentials[$field]);
        }

        $validator = Validator::make(
            $credentials,
            [
                'password' => 'required|min:6',
                'token' => 'required'
            ]
            );
        if ($validator->fails())
        {
            return response([
                'success' => false, 
                'message' => $validator->messages(), 
                'status_code' => 400 
            ]);
        }

        $token = $credentials['token'];
        $pr = PasswordResets::where('token', $token)->first(['email', 'created_at']);
        $email = $pr['email'];
        if(!$email) {
            return response([
                'success' => false, 
                'message' => 'Invalid reset password link!', 
                'status_code' => 404 
            ]);
        }

        $dateCreated = strtotime($pr['created_at']);
        $expireInterval = 86400; // token expire interval in seconds (24 h)
        $currentTime = time();

        if($currentTime  - $dateCreated > $expireInterval) {
            return response([
                'success' => false, 
                'message' => 'The time to reset password has expired!', 
                'status_code' => 400 
            ]);
        }

        $password = bcrypt($credentials['password']);
        $updatedRows = User::where('email', $email)->update(['password' => $password]);
        if($updatedRows > 0) {
            PasswordResets::where('token', $token)->delete();
            return response([
                'success' => true, 
                'message' => 'The password has been changed successfully!', 
                'status_code' => 200 
            ]);
        }
        return response([
                'success' => false, 
                'message' => $error, 
                'status_code' => 500 
        ]);
    }
}
